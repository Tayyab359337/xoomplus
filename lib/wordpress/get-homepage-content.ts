import type { AgencyMetric, PartnerLogo } from "@/lib/data/homepage";
import { aboutContent } from "@/lib/data/homepage";
import type { BlogPost } from "@/lib/data/blogs";
import type { FaqItem } from "@/lib/data/faq";
import { footerCopy } from "@/lib/data/footer";
import type { PortfolioProject, PortfolioTone } from "@/lib/data/portfolio";
import { serviceCategories, type ServiceCategory } from "@/lib/data/services";
import type { Testimonial } from "@/lib/data/testimonials";

import { WP_HOME_PAGE_ID, WP_ORIGIN, WP_REST } from "./config";
import { parseHomepageHtml } from "./parse-homepage-html";
import type { HomepageContent } from "./types";
import { mapWpHref } from "./urls";

const PORTFOLIO_TONES: PortfolioTone[] = [
  "ember",
  "ink",
  "sand",
  "steel",
  "olive",
];

/** Map static main categories → a representative WP homepage service card for image/link. */
const WP_MAIN_SERVICE_MATCH: Record<
  string,
  { nameIncludes?: string; categoryIncludes?: string; hrefFallback: string }
> = {
  "digital-marketing": {
    categoryIncludes: "digital marketing",
    nameIncludes: "social media",
    hrefFallback: `${WP_ORIGIN}/digital-marketing/`,
  },
  "web-development": {
    categoryIncludes: "web solutions",
    nameIncludes: "wordpress",
    hrefFallback: `${WP_ORIGIN}/web-solutions/`,
  },
  "graphic-design": {
    categoryIncludes: "graphic design",
    nameIncludes: "logo design",
    hrefFallback: `${WP_ORIGIN}/graphic-design-solutions/`,
  },
  seo: {
    nameIncludes: "seo",
    hrefFallback: `${WP_ORIGIN}/digital-marketing/search-engine-optimisation-seo/`,
  },
  "paid-advertising": {
    nameIncludes: "ppc",
    hrefFallback: `${WP_ORIGIN}/digital-marketing/ppc-ads-services/`,
  },
  "content-strategy": {
    nameIncludes: "content marketing",
    hrefFallback: `${WP_ORIGIN}/digital-marketing/content-marketing/`,
  },
};

const PORTFOLIO_CONFIGS = [
  { y: -28, rotate: -12, zIndex: 2 },
  { y: 24, rotate: 8, zIndex: 3 },
  { y: -72, rotate: -5, zIndex: 4 },
  { y: 18, rotate: 11, zIndex: 5 },
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function decodeHtml(input: string): string {
  return input
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#038;|&amp;/g, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

type WpPost = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string }>;
  };
};

type WpMedia = {
  id: number;
  source_url: string;
  alt_text?: string;
  title?: { rendered?: string };
  slug?: string;
};

type WpPage = {
  content?: { rendered?: string };
};

type WpContactPage = {
  content?: { rendered?: string };
};

function normalizeMatchKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreMediaForProject(
  projectName: string,
  media: WpMedia,
): number {
  const nameKey = normalizeMatchKey(projectName);
  const nameTokens = nameKey.split(" ").filter((t) => t.length > 2);
  const haystack = normalizeMatchKey(
    [media.source_url, media.slug || "", media.title?.rendered || "", media.alt_text || ""].join(
      " ",
    ),
  );

  let score = 0;

  if (haystack.includes("portfolio") || haystack.includes("case study")) {
    score += 6;
  } else if (haystack.includes("project")) {
    score += 4;
  }

  if (
    haystack.includes("logo") ||
    haystack.includes("cropped") ||
    haystack.includes("icon")
  ) {
    score -= 8;
  }

  for (const token of nameTokens) {
    if (haystack.includes(token)) score += 3;
  }

  if (nameTokens.length > 0) {
    const hits = nameTokens.filter((t) => haystack.includes(t)).length;
    if (hits === nameTokens.length) score += 8;
  }

  return score;
}

/**
 * Resolve a portfolio image for each case study:
 * 1) homepage hover background when present
 * 2) WordPress media library match by project name
 */
async function resolvePortfolioImages(
  items: Array<{ name: string; image?: string }>,
): Promise<Map<string, { src: string; alt: string }>> {
  const resolved = new Map<string, { src: string; alt: string }>();

  for (const item of items) {
    if (item.image) {
      resolved.set(item.name, {
        src: item.image,
        alt: `${item.name} case study`,
      });
    }
  }

  const missing = items.filter((item) => !resolved.has(item.name));
  if (missing.length === 0) return resolved;

  const mediaPools = await Promise.all([
    fetchJson<WpMedia[]>(
      `${WP_REST}/media?search=portfolio&per_page=40&_fields=id,source_url,alt_text,title,slug`,
    ).catch(() => [] as WpMedia[]),
    ...missing.map((item) =>
      fetchJson<WpMedia[]>(
        `${WP_REST}/media?search=${encodeURIComponent(item.name.split(" ")[0] || item.name)}&per_page=10&_fields=id,source_url,alt_text,title,slug`,
      ).catch(() => [] as WpMedia[]),
    ),
  ]);

  const pool = new Map<number, WpMedia>();
  for (const list of mediaPools) {
    for (const media of list) {
      pool.set(media.id, media);
    }
  }

  const allMedia = [...pool.values()];

  for (const item of missing) {
    let best: WpMedia | null = null;
    let bestScore = 0;

    for (const media of allMedia) {
      const score = scoreMediaForProject(item.name, media);
      if (score > bestScore) {
        bestScore = score;
        best = media;
      }
    }

    // Require a meaningful match (at least one strong name token + portfolio cue, or full name).
    if (best && bestScore >= 8 && best.source_url) {
      resolved.set(item.name, {
        src: best.source_url.replace(
          /-\d+x\d+(?=\.(?:webp|jpe?g|png|gif))/i,
          "",
        ),
        alt: best.alt_text || `${item.name} case study`,
      });
    }
  }

  return resolved;
}

/**
 * Fetch WordPress homepage content and map it onto existing Next.js data shapes.
 * Hero is intentionally excluded.
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  const [page, html, posts, contactPage] = await Promise.all([
    fetchJson<WpPage>(`${WP_REST}/pages/${WP_HOME_PAGE_ID}`),
    fetchText(`${WP_ORIGIN}/`),
    fetchJson<WpPost[]>(
      `${WP_REST}/posts?per_page=3&_embed=1&orderby=date&order=desc`,
    ),
    fetchJson<WpContactPage>(`${WP_REST}/pages/1079?_fields=content`),
  ]);

  // Prefer live HTML (complete Elementor markup); fall back to REST content.
  const sourceHtml = html.length > 10_000 ? html : page.content?.rendered || "";
  const parsed = parseHomepageHtml(sourceHtml);
  const portfolioImages = await resolvePortfolioImages(parsed.portfolio);

  const logos: PartnerLogo[] = parsed.logos.map((logo) => ({
    name: logo.name,
    src: logo.src,
  }));

  const aboutBody = (parsed.about.body || aboutContent.body).replace(/\s+/g, " ").trim();
  const aboutSentences = aboutBody.split(/(?<=\.)\s+/).filter(Boolean);
  const aboutIntro =
    aboutSentences[0] ?? aboutContent.intro;
  const aboutRest =
    aboutSentences.slice(1).join(" ").trim() || "";

  const about: HomepageContent["about"] = {
    index: "01",
    eyebrow: parsed.about.eyebrow || aboutContent.eyebrow,
    intro: aboutIntro,
    statementLines: [
      "Smart Digital Marketing",
      "For Real Business Growth",
    ],
    body: aboutRest,
    meta: [
      { label: "Client Satisfaction", value: "99%" },
      { label: "Project Success Rate", value: "99%" },
    ],
    cta: {
      label: parsed.about.ctaLabel || aboutContent.cta.label,
      href: mapWpHref(parsed.about.ctaHref || aboutContent.cta.href),
    },
    image: aboutContent.image
      ? { src: aboutContent.image.src, alt: aboutContent.image.alt }
      : null,
  };

  const metrics: AgencyMetric[] = parsed.metrics.slice(0, 3).map((metric) => ({
    id: slugify(metric.label),
    label: metric.label,
    value: metric.value,
    suffix: metric.suffix,
  }));

  // Keep the original static main categories + subservices.
  // Only enrich image/href from WordPress homepage cards.
  const services: ServiceCategory[] = serviceCategories.map((category) => {
    const rule = WP_MAIN_SERVICE_MATCH[category.id];
    const wpCards = parsed.services;
    const byName = rule?.nameIncludes
      ? wpCards.find((s) =>
          s.name.toLowerCase().includes(rule.nameIncludes!),
        )
      : undefined;
    const byCategory = rule?.categoryIncludes
      ? wpCards.find((s) =>
          s.category.toLowerCase().includes(rule.categoryIncludes!),
        )
      : undefined;
    const wp = byName ?? byCategory;

    return {
      ...category,
      children: category.children.map((child) => ({ ...child })),
      image: wp?.image,
      href: mapWpHref(wp?.link ?? rule?.hrefFallback ?? ""),
    };
  });

  const portfolio: PortfolioProject[] = parsed.portfolio.map((item, index) => {
    const media = portfolioImages.get(item.name);
    const image = media?.src || item.image || undefined;
    return {
      id: slugify(item.name),
      title: item.name,
      category: item.category,
      summary: item.description,
      technologies: [],
      image,
      imageAlt: image
        ? media?.alt || `${item.name} case study`
        : undefined,
      href: mapWpHref(item.link),
      ctaLabel: "Read More",
      tone: PORTFOLIO_TONES[index % PORTFOLIO_TONES.length]!,
      config: PORTFOLIO_CONFIGS[index % PORTFOLIO_CONFIGS.length]!,
    };
  });

  const faqs: FaqItem[] = parsed.faqs.map((faq) => ({
    id: slugify(faq.question),
    question: faq.question,
    answer: faq.answer,
  }));

  const testimonials: Testimonial[] = parsed.testimonials.map((item) => ({
    id: slugify(item.name),
    quote: item.quote,
    name: item.name,
    role: item.title,
    company: "",
    avatar: item.avatar,
    avatarAlt: item.name,
  }));

  const homepageTitles = [
    "WordPress Development Trends to Watch in 2026",
    "Progressive Web Apps vs Native",
    "Shopify vs WooCommerce",
  ];

  const homepagePosts = posts.filter((post) =>
    homepageTitles.some((title) =>
      decodeHtml(post.title.rendered).includes(title.split(":")[0]!),
    ),
  );
  const blogSource = homepagePosts.length > 0 ? homepagePosts : posts.slice(0, 3);

  const blogs: BlogPost[] = blogSource.map((post) => {
    const media = post._embedded?.["wp:featuredmedia"]?.[0];
    const title = decodeHtml(post.title.rendered);
    return {
      id: String(post.id),
      title,
      excerpt: decodeHtml(post.excerpt.rendered),
      category: "Insights",
      href: mapWpHref(post.link),
      image: media?.source_url ?? "",
      imageAlt: media?.alt_text || title,
      publishedAt: new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  });

  const headings = parsed.sectionHeadings;

  const logosCopy: HomepageContent["logosCopy"] = {
    eyebrow: headings.logos.eyebrow,
    title: headings.logos.title,
    body: headings.logos.body,
  };

  const metricsCopy: HomepageContent["metricsCopy"] = {
    eyebrow: headings.metrics.eyebrow || "By the numbers",
    title: headings.metrics.title || "Make Your Marketing More Effective",
    body: headings.metrics.body,
  };

  const servicesCopy: HomepageContent["servicesCopy"] = {
    eyebrow: headings.services.eyebrow,
    title: headings.services.title || "We Are A Creative Digital Marketing Agency",
    body: headings.services.body,
  };

  const portfolioCopy: HomepageContent["portfolioCopy"] = {
    eyebrow: headings.portfolio.eyebrow,
    title: headings.portfolio.title || "Best Case studies",
    body: headings.portfolio.body,
    exploreCta: {
      label: headings.portfolio.exploreLabel,
      href: mapWpHref(headings.portfolio.exploreHref),
    },
  };

  const faqsCopy: HomepageContent["faqsCopy"] = {
    eyebrow: headings.faqs.eyebrow,
    title: headings.faqs.title || "Let's make something awesome together",
    body: headings.faqs.body,
  };

  const testimonialsCopy: HomepageContent["testimonialsCopy"] = {
    eyebrow: headings.testimonials.eyebrow,
    title:
      headings.testimonials.title ||
      "Discover how XoomPlus drives real growth for businesses like yours",
    body: headings.testimonials.body,
  };

  const blogsCopy: HomepageContent["blogsCopy"] = {
    eyebrow: headings.blogs.eyebrow,
    title: headings.blogs.title || "Insights & Tips to Boost Your Business Online",
    body: headings.blogs.body,
    viewAll: {
      label: headings.blogs.viewAllLabel,
      href: mapWpHref(headings.blogs.viewAllHref),
    },
  };

  const contactCopy: HomepageContent["contactCopy"] = {
    eyebrow: headings.contact.eyebrow,
    title: headings.contact.title || "How can we help you?",
    body: headings.contact.body,
  };

  // Keep existing CTA media — do not migrate WP CTA / background images.
  const cta: HomepageContent["cta"] = {
    eyebrow: parsed.cta.eyebrow,
    title: parsed.cta.title || "Get expert guidance tailored to your business needs",
    body: "Have a question or need a custom solution? Our XoomPlus team is here to guide you.",
    primaryCta: {
      label: parsed.cta.buttonLabel,
      href: parsed.cta.buttonHref,
    },
    secondaryCta: {
      label: "Contact Us",
      href: mapWpHref(`${WP_ORIGIN}/contact/`),
    },
    image: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
      alt: "Creative team collaborating around a studio table",
    },
  };

  const contactHtml = contactPage.content?.rendered || "";
  const emailMatch = contactHtml.match(
    /([a-z0-9._%+-]+@xoomplus\.co\.uk)/i,
  );
  const pakPhone = contactHtml.match(/\+92\s*3280\s*397969/)?.[0] ?? "+92 3280 397969";
  const ukPhone = contactHtml.match(/\+44\s*330\s*010\s*4786/)?.[0] ?? "+44 330 010 4786";

  const footer: HomepageContent["footer"] = {
    tagline: "Digital marketing, web & design experts.",
    wordmark: "Xoomplus",
    navigation: parsed.footerNav.map((item) => ({
      label: item.label,
      href: mapWpHref(item.href),
    })),
    services: [
      {
        label: "Digital Marketing",
        href: mapWpHref(`${WP_ORIGIN}/digital-marketing/`),
      },
      {
        label: "Web Solutions",
        href: mapWpHref(`${WP_ORIGIN}/web-solutions/`),
      },
      {
        label: "Graphic Design Solutions",
        href: mapWpHref(`${WP_ORIGIN}/graphic-design-solutions/`),
      },
      {
        label: "Our Services",
        href: mapWpHref(`${WP_ORIGIN}/services/`),
      },
    ],
    social: parsed.social.length > 0 ? parsed.social : [...footerCopy.social],

    contact: {
      email: emailMatch?.[1] ?? "info@xoomplus.co.uk",
      phone: ukPhone.replace(/\s+/g, " "),
      addressLines: [
        `Pakistan: ${pakPhone.replace(/\s+/g, " ")}`,
        "Plot 207, Service Rd East I-10/3, Islamabad",
        `UK: ${ukPhone.replace(/\s+/g, " ")}`,
        "33 King St, Blackburn BB2 2DH, United Kingdom",
      ],
    },
    legal: [
      {
        label: "Privacy Policy",
        href: mapWpHref(`${WP_ORIGIN}/privacy-policy/`),
      },
    ],
    copyrightName: "Xoomplus",
  };

  return {
    logos,
    logosCopy,
    about,
    metrics,
    metricsCopy,
    services,
    servicesCopy,
    portfolio,
    portfolioCopy,
    faqs,
    faqsCopy,
    cta,
    testimonials,
    testimonialsCopy,
    blogs,
    blogsCopy,
    contactCopy,
    footer,
  };
}
