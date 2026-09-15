function decodeHtml(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export type ParsedLogo = { name: string; src: string };
export type ParsedService = {
  name: string;
  image: string;
  link: string;
  category: string;
};
export type ParsedPortfolio = {
  name: string;
  category: string;
  description: string;
  link: string;
  image: string;
};
export type ParsedTestimonial = {
  title: string;
  quote: string;
  name: string;
  avatar: string;
};
export type ParsedMetric = {
  label: string;
  value: number;
  suffix: string;
};
export type ParsedFaq = { question: string; answer: string };

/** Prefer full-size upload URLs over WordPress resized variants (-300x85 etc.). */
function normalizeUploadUrl(src: string): string {
  return src.replace(/-\d+x\d+(?=\.(?:webp|jpe?g|png|gif|svg))/i, "");
}

function humanizeLogoName(altOrFile: string): string {
  const raw = decodeHtml(altOrFile)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/^(cropped[-_]?)/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    // Split camelCase leftovers like gopsychLogo → gopsych Logo
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b(logo|header)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!raw) return "Partner";
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Pull brand logos from the Elementor image carousel under
 * "Brands That Believe in Us" — no hardcoded filename whitelist.
 */
function parseBrandLogosFromHtml(html: string): ParsedLogo[] {
  const brandsIdx = html.search(/Brands That Believe in Us/i);
  if (brandsIdx < 0) return [];

  const windowHtml = html.slice(brandsIdx, brandsIdx + 20_000);
  const carouselIdx = windowHtml.search(
    /elementor-widget-image-carousel|elementor-image-carousel/i,
  );
  const block =
    carouselIdx >= 0
      ? windowHtml.slice(carouselIdx, carouselIdx + 12_000)
      : windowHtml.slice(0, 12_000);

  const logos: ParsedLogo[] = [];
  const seen = new Set<string>();
  const imgTagRe = /<img\b[^>]*>/gi;
  let imgMatch: RegExpExecArray | null;

  while ((imgMatch = imgTagRe.exec(block))) {
    const tag = imgMatch[0];
    if (!/swiper-slide-image|elementor-carousel-image/i.test(tag)) continue;

    const src =
      tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ??
      tag.match(/\bdata-src=["']([^"']+)["']/i)?.[1] ??
      tag.match(/\bdata-lazy-src=["']([^"']+)["']/i)?.[1];
    if (!src || !/wp-content\/uploads/i.test(src)) continue;

    const normalized = normalizeUploadUrl(src);
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] ?? "";
    const fileName = normalized.split("/").pop() ?? alt;
    logos.push({
      name: humanizeLogoName(alt || fileName),
      src: normalized,
    });
  }

  return logos;
}

/**
 * Extract homepage sections from the rendered Elementor HTML.
 * Prefer this over dumping Elementor markup into React.
 */
export function parseHomepageHtml(html: string) {
  const logos = parseBrandLogosFromHtml(html);
  const services: ParsedService[] = [];
  const serviceRe =
    /src="(https:\/\/xoomplus\.co\.uk\/wp-content\/uploads\/2025\/08\/(?:social-media-marketing|copntent-marketing|ppc-ads-services|seo-services|email-marketing|ecommerce|web-dev|custom-web-development|shopify-store|web-maintenancew-ans-support|web-hosting-and-domain|web-ui-ux|infographic-desaign|social-media-post-design|logo-designx|brand-identity-design|print-deign)[^"]*)"[\s\S]{0,900}?<h3 class="elementor-heading-title[^"]*"><a href="([^"]+)">([^<]+)<\/a><\/h3>[\s\S]{0,400}?<p class="elementor-heading-title[^"]*"><a href="[^"]+">([^<]+)<\/a><\/p>/gi;

  let match: RegExpExecArray | null;
  while ((match = serviceRe.exec(html))) {
    services.push({
      image: match[1]!.replace(/-\d+x\d+(?=\.webp)/, ""),
      link: match[2]!,
      name: decodeHtml(match[3]!),
      category: decodeHtml(match[4]!),
    });
  }

  const portfolio: ParsedPortfolio[] = [];
  const portfolioRe =
    /<div class="case-studies-items[\s\S]*?<h3><a href="([^"]+)">([^<]+)<\/a><\/h3>\s*<span>([\s\S]*?)<\/span>\s*<p>([\s\S]*?)<\/p>/gi;
  while ((match = portfolioRe.exec(html))) {
    const blockEnd = html.indexOf('case-studies-items', match.index + 20);
    const block = html.slice(
      match.index,
      blockEnd === -1 ? match.index + 2500 : blockEnd,
    );
    const imageMatch = block.match(
      /case-studies-hover[^>]*style="[^"]*background-image:\s*url\('([^']*)'\)/i,
    );
    const rawImage = imageMatch?.[1]?.trim() || "";
    const image = rawImage
      ? rawImage.replace(/-\d+x\d+(?=\.(?:webp|jpe?g|png|gif))/i, "")
      : "";

    portfolio.push({
      link: match[1]!,
      name: decodeHtml(match[2]!),
      category: decodeHtml(match[3]!),
      description: decodeHtml(match[4]!),
      image,
    });
  }

  const testimonials: ParsedTestimonial[] = [];
  // Attribute order on <img> varies (class/src/alt); keep the match local to each card.
  const testimonialRe =
    /<p class="[^"]*card-title[^"]*">([\s\S]*?)<\/p>[\s\S]*?<p class="[^"]*card-text[^"]*">([\s\S]*?)<\/p>[\s\S]*?<img\b([^>]*\bavatar\b[^>]*)>[\s\S]*?<span class="[^"]*author-name[^"]*">([\s\S]*?)<\/span>/gi;
  while ((match = testimonialRe.exec(html))) {
    const imgAttrs = match[3] ?? "";
    const avatar =
      imgAttrs.match(/\bsrc=["']([^"']+)["']/i)?.[1] ??
      imgAttrs.match(/\bdata-src=["']([^"']+)["']/i)?.[1] ??
      "";
    const alt = imgAttrs.match(/\balt=["']([^"']*)["']/i)?.[1] ?? "";
    const quote = decodeHtml(match[2]!.replace(/<[^>]+>/g, " "));
    const name = decodeHtml(match[4]!.replace(/<[^>]+>/g, " ")) || decodeHtml(alt);
    if (!quote || !name) continue;
    testimonials.push({
      title: decodeHtml(match[1]!.replace(/<[^>]+>/g, " ")),
      quote,
      avatar,
      name,
    });
  }

  const metrics: ParsedMetric[] = [];
  const metricRe =
    /<div class="elementor-counter-title">([^<]+)<\/div>\s*<div class="elementor-counter-number-wrapper">[\s\S]*?data-to-value="(\d+)"[\s\S]*?<span class="elementor-counter-number-suffix">([^<]*)<\/span>/gi;
  while ((match = metricRe.exec(html))) {
    metrics.push({
      label: decodeHtml(match[1]!),
      value: Number(match[2]),
      suffix: decodeHtml(match[3]!),
    });
  }

  const faqs: ParsedFaq[] = [
    {
      question: "What services does XoomPlus offer?",
      answer:
        "We provide digital marketing, web development, graphic design, SEO, PPC, social media marketing, branding, and more to help businesses grow.",
    },
    {
      question: "How can digital marketing help my business?",
      answer:
        "Our strategies boost your online visibility, drive targeted traffic, and increase conversions to grow your revenue.",
    },
    {
      question: "Do you work with startups and small businesses?",
      answer:
        "Yes! We tailor our solutions for startups, SMEs, and large enterprises to fit their goals and budget.",
    },
    {
      question: "How do I get started with XoomPlus?",
      answer:
        "Simply fill out our contact form or call us, and our team will create a custom plan for your business.",
    },
  ].filter((faq) => html.includes(faq.question));

  // About
  const aboutEyebrowMatch = html.match(/>\s*About XoomPlus\s*</i);
  const aboutHeadingMatch = html.match(
    /Smart Digital Marketing For Real Business Growth/i,
  );
  const aboutBodyMatch = html.match(
    /We are a top digital marketing company that works to grow your business by providing expert and specialised digital services\.[\s\S]*?Google Ads\./i,
  );
  const exploreMatch = html.match(
    /href="(https:\/\/xoomplus\.co\.uk\/about\/)"[^>]*>[\s\S]*?EXPLORE MORE/i,
  );

  const about = {
    eyebrow: aboutEyebrowMatch ? "About XoomPlus" : "About",
    heading: aboutHeadingMatch
      ? "Smart Digital Marketing For Real Business Growth"
      : "",
    body: aboutBodyMatch
      ? decodeHtml(aboutBodyMatch[0].replace(/<[^>]+>/g, " "))
      : "",
    ctaLabel: "EXPLORE MORE",
    ctaHref: exploreMatch?.[1] ?? "/about/",
  };

  // CTA band
  const ctaEyebrow = html.includes("Talk to a Specialist Today")
    ? "Talk to a Specialist Today"
    : "Start here";
  const ctaTitleMatch = html.match(
    /Get expert guidance tailored\s*(?:<\/br>|<br\s*\/?>)?\s*to your business needs/i,
  );
  const ctaButtonMatch = html.match(
    /href="(tel:[^"]+)"[^>]*>[\s\S]*?WhatsApp Us/i,
  );

  const cta = {
    eyebrow: ctaEyebrow,
    title: ctaTitleMatch
      ? "Get expert guidance tailored to your business needs"
      : "",
    body: "",
    buttonLabel: "WhatsApp Us",
    buttonHref: ctaButtonMatch?.[1]
      ? decodeHtml(ctaButtonMatch[1]).replace(/^tel:\s*/, "tel:")
      : "tel:+923280397969",
  };

  // Section headings from WordPress homepage (Elementor labels + titles)
  const sectionHeadings = {
    logos: {
      eyebrow: html.includes("Brands That Believe in Us")
        ? "Brands That Believe in Us"
        : "Partners",
      title: "",
      body: "",
    },
    metrics: {
      eyebrow: "",
      title: html.includes("Make Your Marketing More Effective")
        ? "Make Your Marketing More Effective"
        : "",
      body: "",
    },
    services: {
      eyebrow: html.includes("Our Services") ? "Our Services" : "Services",
      title: html.includes("We Are A Creative Digital Marketing Agency")
        ? "We Are A Creative Digital Marketing Agency"
        : "",
      body: "",
    },
    portfolio: {
      eyebrow: html.includes("Case Studies") ? "Case Studies" : "Selected work",
      title: html.includes("Best Case studies")
        ? "Best Case studies"
        : html.includes("Best Case Studies")
          ? "Best Case Studies"
          : "",
      body: "",
      exploreLabel: html.includes("Read More") ? "Read More" : "Explore more",
      exploreHref: "https://xoomplus.co.uk/projects/",
    },
    faqs: {
      eyebrow: html.includes("FAQ's") || html.includes("FAQs") ? "FAQ's" : "Questions",
      title:
        html.includes("Let’s make something awesome together") ||
        html.includes("Let's make something awesome together")
          ? "Let's make something awesome together"
          : "",
      body: html.includes("Quick answers")
        ? html.includes("Business growth")
          ? "Quick answers · Business growth"
          : "Quick answers"
        : "",
    },
    testimonials: {
      eyebrow: /testimonials/i.test(html) ? "testimonials" : "Clients",
      title: html.includes(
        "Discover how XoomPlus drives real growth for businesses like yours",
      )
        ? "Discover how XoomPlus drives real growth for businesses like yours"
        : "",
      body: "",
    },
    blogs: {
      eyebrow: html.includes("BLOG & NEWS") ? "BLOG & NEWS" : "Journal",
      title: html.includes("Insights & Tips to Boost Your Business Online")
        ? "Insights & Tips to Boost Your Business Online"
        : "",
      body: "",
      viewAllLabel: html.includes("All Blogs") ? "All Blogs" : "All writing",
      viewAllHref:
        html.match(
          /href="(https:\/\/xoomplus\.co\.uk\/blogs\/)"[^>]*>[\s\S]*?All Blogs/i,
        )?.[1] ?? "https://xoomplus.co.uk/blogs/",
    },
    contact: {
      eyebrow: html.includes("Contact Us") ? "Contact Us" : "Contact",
      title: html.includes("How can we help you?")
        ? "How can we help you?"
        : "",
      body: html.includes(
        "Have a question or need a custom solution? Our XoomPlus team is here to guide you",
      )
        ? "Have a question or need a custom solution? Our XoomPlus team is here to guide you with expert digital marketing, web, and design support. Let’s talk today!"
        : "",
    },
  };

  // Blogs chrome (kept for compatibility; prefer sectionHeadings.blogs)
  const blogsEyebrow = sectionHeadings.blogs.eyebrow;
  const blogsTitle = sectionHeadings.blogs.title;
  const blogsViewAll = sectionHeadings.blogs.viewAllHref;

  // Footer nav
  const footerChunk = html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] ?? "";
  const footerNav: { label: string; href: string }[] = [];
  const footerNavRe =
    /<a[^>]+href="(https:\/\/xoomplus\.co\.uk\/(?:about|services|blogs|contact)\/?)"[^>]*>([\s\S]*?)<\/a>/gi;
  while ((match = footerNavRe.exec(footerChunk))) {
    const label = decodeHtml(match[2]!.replace(/<[^>]+>/g, " "));
    if (!label) continue;
    if (!footerNav.some((item) => item.href === match![1])) {
      footerNav.push({ href: match[1]!, label });
    }
  }

  const social: { label: string; href: string }[] = [];
  if (html.includes("facebook.com/xoomplus1")) {
    social.push({
      label: "Facebook",
      href: "https://www.facebook.com/xoomplus1/",
    });
  }
  if (html.includes("instagram.com/xoomplus1")) {
    social.push({
      label: "Instagram",
      href: "https://www.instagram.com/xoomplus1/",
    });
  }
  if (html.includes("linkedin.com/company/xoomplus")) {
    social.push({
      label: "LinkedIn",
      href: "https://pk.linkedin.com/company/xoomplus",
    });
  }

  return {
    logos,
    services,
    portfolio,
    testimonials,
    metrics,
    faqs,
    about,
    cta,
    sectionHeadings,
    blogsEyebrow,
    blogsTitle,
    blogsViewAllHref: blogsViewAll,
    footerNav,
    social,
  };
}
