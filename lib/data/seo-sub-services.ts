export type SeoSubServiceVisual =
  | "on-page"
  | "off-page"
  | "technical"
  | "keywords"
  | "tech-audit"
  | "local"
  | "links"
  | "competitors"
  | "analytics"
  | "full-audit"
  | "content";

export type SeoSubService = {
  slug: string;
  title: string;
  shortLabel: string;
  description: string;
  visual: SeoSubServiceVisual;
};

/**
 * SEO capabilities — hardcoded from WordPress page 3062.
 * WP shows items 1–4 by default and 5–11 behind Load More; this design lists all 11 in the existing rail.
 */
export const seoSubServices: SeoSubService[] = [
  {
    slug: "on-page-seo",
    title: "On-page SEO",
    shortLabel: "On-page",
    description:
      "We fix titles, tags, structure and speed to boost your rank. This is done by adding SEO elements directly on-page.",
    visual: "on-page",
  },
  {
    slug: "off-page-seo",
    title: "Off-page SEO",
    shortLabel: "Off-page",
    description:
      "Your domain authority is key. We build it up through backlinks, guest posts and mentions. This make your reputation skyrocket.",
    visual: "off-page",
  },
  {
    slug: "technical-seo",
    title: "Technical SEO",
    shortLabel: "Technical",
    description:
      "We make it easier for search engines to crawl on your site. This allows easier indexing. Also it means that you get directed to the right traffic.",
    visual: "technical",
  },
  {
    slug: "keyword-research",
    title: "Keyword research",
    shortLabel: "Keywords",
    description:
      "We base our keyword research on intent. In modern search engines intent is the key. We find the best keywords using intent, search volume and competitor data. Making sure no stone is left unturned in our quest to give you the best SEO services.",
    visual: "keywords",
  },
  {
    slug: "technical-seo-audit",
    title: "Technical SEO Audit",
    shortLabel: "Tech audit",
    description:
      "We run a deep scan of your site. Any issues preventing you from ranking. We eliminate.",
    visual: "tech-audit",
  },
  {
    slug: "gmb-optimisation",
    title: "Google My Business (GMB) Optimisation",
    shortLabel: "GMB",
    description:
      "Local presence is where it all starts. We fine tune your presence of Google Maps and Local Maps, so you stand out where it matters most.",
    visual: "local",
  },
  {
    slug: "link-building",
    title: "Link building",
    shortLabel: "Links",
    description:
      "Secure backlinks ensure domain authority. Strong domain authority means great SEO. Remember this. We certainly do, hence we acquire best backlinks so you get top ranked domain authority.",
    visual: "links",
  },
  {
    slug: "competitor-analysis",
    title: "Competitor Analysis",
    shortLabel: "Competitors",
    description:
      "Rivalries drive the market. We scan out your rivals, spot loopholes and give you the scoop on the winning moves.",
    visual: "competitors",
  },
  {
    slug: "analytics-reporting",
    title: "Analytics & Reporting",
    shortLabel: "Analytics",
    description:
      "Reports are supposed to help not confuse. Our SEO services give reports that are easy to read and well researched. We track your numbers. Everything from your keywords, growth and conversions. This gives you a picture you can trust.",
    visual: "analytics",
  },
  {
    slug: "complete-seo-audit",
    title: "Complete SEO Audit",
    shortLabel: "Full audit",
    description:
      "SEO content optimisation is about checks and rechecks. We check your website all over, with advanced tools and expertise. This uncovers flaws and any chances of growth.",
    visual: "full-audit",
  },
  {
    slug: "seo-content-optimisation",
    title: "SEO Content Optimisation",
    shortLabel: "Content",
    description:
      "We make your website a heaven for keywords and seo content. Everything from design to words to placement, we will have content optimised for SEO.",
    visual: "content",
  },
];

export const seoSubServicesCopy = {
  eyebrow: "Our Services",
  title: "Our Search Engine Optimisation (SEO) Services",
  body: "Each month, we identify your audience's top questions and shape a focused plan. We publish engaging social posts, clear blog articles, and simple visuals or videos that match your voice. With our content marketing services, every piece ends with a clear call to action so you can track clicks, sign-ups, and shares without guesswork.",
} as const;
