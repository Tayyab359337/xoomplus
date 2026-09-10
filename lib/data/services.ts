export type ChildService = {
  id: string;
  label: string;
  summary: string;
};

export type ServiceTone =
  | "ember"
  | "ink"
  | "sand"
  | "steel"
  | "rose"
  | "olive";

export type ServiceCategory = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** Visual panel tone — mapped in CSS, not hardcoded purple */
  tone: ServiceTone;
  children: ChildService[];
};

/**
 * Editable homepage services — feed carousel / accordion from this object only.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    tagline: "Demand that compounds",
    description:
      "Full-funnel programs that connect brand story to measurable growth — without the agency fog.",
    tone: "ember",
    children: [
      {
        id: "social",
        label: "Social Media Marketing",
        summary: "Channel systems built for reach and retention.",
      },
      {
        id: "performance",
        label: "Performance Marketing",
        summary: "Paid acquisition tuned to CAC and LTV.",
      },
      {
        id: "email",
        label: "Email Marketing",
        summary: "Lifecycle flows that earn the open.",
      },
      {
        id: "cro",
        label: "Conversion Optimization",
        summary: "Tests that turn traffic into revenue.",
      },
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    tagline: "Products that ship",
    description:
      "From marketing sites to custom applications — engineered for speed, clarity, and longevity.",
    tone: "ink",
    children: [
      {
        id: "wordpress",
        label: "WordPress",
        summary: "Editorial CMS builds that editors actually enjoy.",
      },
      {
        id: "custom-apps",
        label: "Custom Web Applications",
        summary: "Bespoke product surfaces with durable architecture.",
      },
      {
        id: "ecommerce",
        label: "E-commerce",
        summary: "Storefronts optimized for conversion and ops.",
      },
      {
        id: "headless",
        label: "Headless Development",
        summary: "Composable stacks with fast frontends.",
      },
    ],
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    tagline: "Visual systems with teeth",
    description:
      "Identity, campaigns, and design systems that feel considered — never template.",
    tone: "sand",
    children: [
      {
        id: "brand-identity",
        label: "Brand Identity",
        summary: "Marks, type, and language that hold together.",
      },
      {
        id: "campaign",
        label: "Campaign Creative",
        summary: "Assets built for launch moments.",
      },
      {
        id: "systems",
        label: "Design Systems",
        summary: "Reusable components with editorial discipline.",
      },
      {
        id: "packaging",
        label: "Packaging & Print",
        summary: "Tactile work that survives the scroll.",
      },
    ],
  },
  {
    id: "seo",
    title: "SEO",
    tagline: "Findable by design",
    description:
      "Technical foundations and content strategy that earn rankings without chasing fads.",
    tone: "steel",
    children: [
      {
        id: "technical",
        label: "Technical SEO",
        summary: "Crawl health, speed, and structure.",
      },
      {
        id: "content-seo",
        label: "Content SEO",
        summary: "Topics mapped to intent and authority.",
      },
      {
        id: "local",
        label: "Local SEO",
        summary: "Presence where your buyers search.",
      },
      {
        id: "audit",
        label: "SEO Audits",
        summary: "Clear findings, prioritized fixes.",
      },
    ],
  },
  {
    id: "paid-advertising",
    title: "Paid Advertising",
    tagline: "Spend with intent",
    description:
      "Media buying across search and social with creative that earns the click.",
    tone: "rose",
    children: [
      {
        id: "search-ads",
        label: "Search Ads",
        summary: "High-intent capture with tight messaging.",
      },
      {
        id: "social-ads",
        label: "Social Ads",
        summary: "Prospecting and retargeting that scale.",
      },
      {
        id: "creative-testing",
        label: "Creative Testing",
        summary: "Iterate until the angle wins.",
      },
      {
        id: "media-planning",
        label: "Media Planning",
        summary: "Budgets mapped to real pipeline goals.",
      },
    ],
  },
  {
    id: "content-strategy",
    title: "Content Strategy",
    tagline: "Narrative as infrastructure",
    description:
      "Editorial calendars, thought leadership, and content ops that feed brand and demand.",
    tone: "olive",
    children: [
      {
        id: "editorial",
        label: "Editorial Systems",
        summary: "Cadence, voice, and distribution.",
      },
      {
        id: "thought",
        label: "Thought Leadership",
        summary: "Positions that make buyers listen.",
      },
      {
        id: "video",
        label: "Video Content",
        summary: "Scripts and formats built to travel.",
      },
      {
        id: "governance",
        label: "Content Governance",
        summary: "Quality bars teams can actually keep.",
      },
    ],
  },
];

export const servicesSectionCopy = {
  eyebrow: "Capabilities",
  title: "Services that move as one system.",
  body: "Browse the carousel — on desktop hover a category, on mobile tap the arrow to open its discipline stack.",
} as const;
