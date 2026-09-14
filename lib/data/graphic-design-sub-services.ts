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
 * Graphic Design Solutions child services — hardcoded from WordPress page 2417.
 * Print Design copy is from WP child page 4343 (listed in the parent Product schema, not as a 6th card).
 * Labels/hrefs align with the Services mega menu — do not invent conflicting services.
 */
export const graphicDesignSubServices: GraphicDesignSubService[] = [
  {
    title: "Website UI/UX Design",
    description:
      "Websites should feel easy and look great. Our graphic design agency design pages that guide visitors straight to what they need. Our work balances a clear layout with your brand's style so users stay engaged. Every screen adapts to mobile and desktop for a smooth experience. With our website UI design, you receive: page layouts that focus on clear paths; mobile-first designs for all devices; visual style matched to your brand identity; and clickable prototypes for early feedback.",
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
      "Charts and numbers come alive in a good infographic. We turn data into visuals that people can scan and understand fast. Icons, colour and layout guide readers through your story. Assets work on slides, web pages or social feeds. We offer: data-driven charts and graphs; custom icons and simple illustrations; color schemes for clarity and impact; and editable files for easy updates.",
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
      "Social posts bring your brand's message right to your audience's feed. Xoomplus crafts visuals that cut through the noise and spark real engagement. Each post is tailored to reflect your brand identity and encourage shares, comments, and clicks. With our social media design, you benefit from: image posts sized and styled for each platform; carousel and story layouts that tell a clear story; branded templates that keep your look consistent; and quick-turnaround graphics for timely promotions.",
    category: "Campaign",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Social media creative layouts on a phone",
    slug: "social-media-post-design",
    href: "/graphic-design-solutions/social-media-post-design/",
  },
  {
    title: "Logo Design",
    description:
      "A logo is the face of your brand and a core element of our digital graphic design services. We craft marks that speak to your audience and mirror your values. We focus on shape, color and type to make a symbol you will remember. Each concept is tested and refined to work well at any size or format. With our logo design service, you receive: market-relevant logo concepts; color palette selection for consistency; vector files ready for print and web; and light and dark background variations.",
    category: "Identity",
    image:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Logo sketch and brand mark exploration",
    slug: "logo-design-service",
    href: "/graphic-design-solutions/logo-design-service/",
  },
  {
    title: "Brand Identity Design",
    description:
      "A brand identity ties every piece of your digital graphic design services into one clear story. We set up colour schemes, fonts and style notes that match across all platforms. Consistency builds trust and makes you stand out. We deliver a full guide so your team can apply your identity with ease. With our brand identity service, you gain: complete colour and font guidelines; logo usage rules with real examples; layout templates for common materials; and a PDF style guide for easy reference.",
    category: "Systems",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Brand identity materials laid out on a table",
    slug: "brand-identity-design",
    href: "/graphic-design-solutions/brand-identity-design/",
  },
  {
    title: "Print Design Services",
    description:
      "At XoomPlus, we make your design look amazing when printed and make sure it is aligned with your needs. Our team helps you with custom print design services for all your products, such as brochures, flyers, etc. We take your ideas and turn them into designs that are both beautiful and easy to read. When printed, these designs appear exactly the same on paper.",
    category: "Print",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Printed stationery and design collateral",
    slug: "print-design",
    href: "/graphic-design-solutions/print-design/",
  },
];

export const graphicDesignSubServicesCopy = {
  eyebrow: "Our Services",
  title: "Best Graphic Design Services to Showcase Your Brand",
  body: "Stand out in a crowded market with visuals that tell your story at a glance. XoomPlus's graphic design services include everything from striking logos to engaging infographics. By focusing on your core message and audience, these designs boost recognition, build trust, and guide customers toward action.",
} as const;
