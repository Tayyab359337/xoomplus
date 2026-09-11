export type AgencyMetric = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimalPlaces?: number;
  hint?: string;
};

/**
 * Editable homepage metrics — feed NumberTicker from this object only.
 * Homepage shows exactly three counters (WordPress source).
 */
export const agencyMetrics: AgencyMetric[] = [
  {
    id: "projects-done",
    label: "Projects Done",
    value: 50,
    suffix: "+",
  },
  {
    id: "happy-clients",
    label: "Happy Clients",
    value: 2,
    suffix: "K+",
  },
  {
    id: "team-members",
    label: "Team Members",
    value: 25,
    suffix: "+",
  },
];

export type PartnerLogo = {
  name: string;
  href?: string;
  /** WordPress / remote logo asset when available */
  src?: string;
};

/** Partner / tech marks shown in the LogoLoop band */
export const partnerLogos: PartnerLogo[] = [
  { name: "Figma" },
  { name: "Notion" },
  { name: "Vercel" },
  { name: "Stripe" },
  { name: "Linear" },
  { name: "Shopify" },
  { name: "Webflow" },
  { name: "Framer" },
  { name: "Adobe" },
  { name: "Slack" },
];

/**
 * Editorial About / Studio — copy kept separate from presentation.
 * Image is optional: set `image` to null to render without media.
 */
export const aboutContent = {
  index: "01",
  eyebrow: "About XoomPlus",
  intro:
    "We are a top digital marketing company that works to grow your business by providing expert and specialised digital services.",
  statementLines: [
    "Smart Digital Marketing",
    "For Real Business Growth",
  ],
  body: "Xoomplus blends strategy, SEO, creative, product, and growth marketing into a single operating rhythm — so brands ship sharper work without the handoff tax.",
  meta: [
    { label: "Client Satisfaction", value: "99%" },
    { label: "Project Success Rate", value: "99%" },
  ],
  cta: {
    label: "Explore more",
    href: "/about/",
  },
  image: {
    src: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=80",
    alt: "Art-directed creative workspace with design tools and colour studies",
  },
} as const;

/**
 * Parallax hero image stack (Aceternity) — layered over LiquidEther.
 * Prefer studio / work imagery that matches the site palette.
 */
export const heroParallaxImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
] as const;
