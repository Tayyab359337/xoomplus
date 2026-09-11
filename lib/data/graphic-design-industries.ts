import { graphicDesignSubServices } from "@/lib/data/graphic-design-sub-services";

export type GraphicDesignIndustry = {
  number: string;
  name: string;
  description: string;
  /** Accent token key for editorial hover line */
  accent: "teal" | "ink" | "sand" | "ember" | "steel";
  image: string;
  imageAlt: string;
};

function serviceImage(slug: string) {
  const service = graphicDesignSubServices.find((item) => item.slug === slug);
  if (!service) {
    throw new Error(`Missing graphic design service image for slug: ${slug}`);
  }
  return {
    image: service.image,
    imageAlt: service.imageAlt,
  };
}

export const graphicDesignIndustriesCopy = {
  eyebrow: "Industries we serve",
  title: "Brands that need to look inevitable.",
  body: "Five sectors where visual systems carry the sale.",
} as const;

export const graphicDesignIndustries: GraphicDesignIndustry[] = [
  {
    number: "01",
    name: "Consumer brands",
    description:
      "Packaging cues, campaign worlds, and identity that holds on shelf and in feed.",
    accent: "ember",
    ...serviceImage("brand-identity-design"),
  },
  {
    number: "02",
    name: "SaaS & product",
    description:
      "UI systems, launch visuals, and product storytelling that feel considered — not template.",
    accent: "teal",
    ...serviceImage("website-ui-ux-design"),
  },
  {
    number: "03",
    name: "Retail & commerce",
    description:
      "Merch, lookbooks, and digital storefronts with editorial finish and conversion clarity.",
    accent: "sand",
    ...serviceImage("social-media-post-design"),
  },
  {
    number: "04",
    name: "Professional services",
    description:
      "Quiet authority — decks, reports, and brand systems that signal trust before the pitch.",
    accent: "ink",
    ...serviceImage("infographic-design"),
  },
  {
    number: "05",
    name: "Hospitality & lifestyle",
    description:
      "Atmosphere-led identity, menus, and campaign art that feel tactile and bookable.",
    accent: "steel",
    ...serviceImage("print-design"),
  },
];
