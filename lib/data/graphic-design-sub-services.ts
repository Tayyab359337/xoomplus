export type GraphicDesignSubService = {
  title: string;
  description: string;
  /** Compact discipline label shown as metadata */
  category: string;
  image: string;
  imageAlt: string;
  slug: string;
  href: string;
};

/**
 * Editable Graphic Design Solutions child services.
 * Labels/hrefs align with the Services mega menu — do not invent conflicting services.
 */
export const graphicDesignSubServices: GraphicDesignSubService[] = [
  {
    title: "Website UI/UX Design",
    description:
      "Interface systems that feel considered in every state — from first scroll to checkout — with hierarchy, motion, and craft that convert.",
    category: "Product",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "UI design work on a desk with color swatches",
    slug: "website-ui-ux-design",
    href: "/graphic-design-solutions/website-ui-ux-design/",
  },
  {
    title: "Infographic Design",
    description:
      "Complex ideas reduced to clear visual narratives — charts, maps, and stories built for boardrooms and feeds alike.",
    category: "Editorial",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Data visualization and chart composition",
    slug: "infographic-design",
    href: "/graphic-design-solutions/infographic-design/",
  },
  {
    title: "Social Media Post Design",
    description:
      "Campaign-ready posts with a consistent visual language — scroll-stopping frames that still feel on-brand.",
    category: "Campaign",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e11e55d8?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Social media creative layouts on a phone",
    slug: "social-media-post-design",
    href: "/graphic-design-solutions/social-media-post-design/",
  },
  {
    title: "Logo Design",
    description:
      "Marks with teeth — distinctive, scalable, and durable across print, product, and pixel.",
    category: "Identity",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b7993143468?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Logo sketch and brand mark exploration",
    slug: "logo-design-service",
    href: "/graphic-design-solutions/logo-design-service/",
  },
  {
    title: "Brand Identity Design",
    description:
      "Type, color, and language held together as one system — so every touchpoint feels like the same brand.",
    category: "Systems",
    image:
      "https://images.unsplash.com/photo-1634942537034-2531766687a7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Brand identity materials laid out on a table",
    slug: "brand-identity-design",
    href: "/graphic-design-solutions/brand-identity-design/",
  },
  {
    title: "Print Design Services",
    description:
      "Tactile work that survives the scroll — collateral, packaging cues, and print pieces with editorial finish.",
    category: "Print",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Printed stationery and design collateral",
    slug: "print-design",
    href: "/graphic-design-solutions/print-design/",
  },
];

export const graphicDesignSubServicesCopy = {
  eyebrow: "Capabilities",
  title: "Not one service. A full design stack.",
  body: "Graphic Design Solutions covers the disciplines that keep brands sharp across screens, campaigns, and print.",
} as const;
