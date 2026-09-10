export type PortfolioTone = "ember" | "ink" | "sand" | "steel" | "olive";

export type PortfolioCardConfig = {
  y: number;
  rotate: number;
  zIndex: number;
};

export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  summary: string;
  technologies: string[];
  image: string;
  imageAlt: string;
  href: string;
  ctaLabel: string;
  tone: PortfolioTone;
  config: PortfolioCardConfig;
};

/**
 * Editable homepage portfolio — feed Interface Crafts Cards from this object only.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "northline",
    title: "Northline",
    category: "Brand · Commerce",
    summary:
      "A quiet outdoor label rebuilt as a high-converting story system — from mark to merchandise.",
    technologies: ["Brand", "Shopify", "Art Direction"],
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Editorial retail interior with soft daylight",
    href: "#work",
    ctaLabel: "View case",
    tone: "ember",
    config: { y: -28, rotate: -12, zIndex: 2 },
  },
  {
    id: "atelier-nine",
    title: "Atelier Nine",
    category: "Product · Web",
    summary:
      "An architecture studio site that moves like a portfolio walkthrough — spare, tactile, deliberate.",
    technologies: ["Next.js", "Motion", "CMS"],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Minimal modern workspace with architectural light",
    href: "#work",
    ctaLabel: "View project",
    tone: "ink",
    config: { y: 24, rotate: 8, zIndex: 3 },
  },
  {
    id: "pulse-lab",
    title: "Pulse Lab",
    category: "Growth · Product",
    summary:
      "Performance creative and landing systems that turned a SaaS waitlist into a launch engine.",
    technologies: ["CRO", "Paid Media", "Design System"],
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Abstract product design boards on a studio wall",
    href: "#work",
    ctaLabel: "View work",
    tone: "sand",
    config: { y: -72, rotate: -5, zIndex: 4 },
  },
  {
    id: "harbor-co",
    title: "Harbor & Co.",
    category: "Brand · Film",
    summary:
      "A hospitality rebrand with motion identity — the kind guests remember before the room.",
    technologies: ["Identity", "Motion", "Photography"],
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Warm restaurant dining atmosphere",
    href: "#work",
    ctaLabel: "View case",
    tone: "steel",
    config: { y: 18, rotate: 11, zIndex: 5 },
  },
  {
    id: "signal-os",
    title: "Signal OS",
    category: "Product · UI",
    summary:
      "An operations console redesigned for clarity — fewer panels, faster decisions, quieter chrome.",
    technologies: ["UI/UX", "Design System", "Prototype"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Analytics dashboard on a laptop in a dark studio",
    href: "#work",
    ctaLabel: "View product",
    tone: "olive",
    config: { y: 22, rotate: -6, zIndex: 6 },
  },
];

export const portfolioSectionCopy = {
  eyebrow: "Selected work",
  title: "Projects that refuse to look like everyone else's.",
  body: "A short stack of brand, product, and growth engagements — click a card to open it.",
  exploreCta: {
    label: "Explore more",
    href: "/work",
  },
} as const;
