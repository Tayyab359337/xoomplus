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

/** Industries We Serve — hardcoded from WordPress page 2417. */
export const graphicDesignIndustriesCopy = {
  eyebrow: "Industries we serve",
  title: "Industries We Serve",
  body: "Our graphic design services projects span diverse sectors, including:",
} as const;

export const graphicDesignIndustries: GraphicDesignIndustry[] = [
  {
    number: "01",
    name: "E-Commerce and Retail",
    description:
      "We design banners, product catalogues and social ads that highlight your best offers. Clear layouts and strong calls to action help boost clicks, sales and repeat visits.",
    accent: "ember",
    ...serviceImage("brand-identity-design"),
  },
  {
    number: "02",
    name: "Healthcare and Wellness",
    description:
      "We create brochures, social posts and infographics that explain services clearly and build trust. Clean design and a respectful tone keep patients informed and at ease.",
    accent: "teal",
    ...serviceImage("website-ui-ux-design"),
  },
  {
    number: "03",
    name: "Education and Training",
    description:
      "XoomPlus designs course packs, slide decks and e learning visuals that make lessons stick. Clear sections, simple diagrams and progress cues help learners follow the flow. Fonts stay readable and colours meet accessibility rules. Reusable templates make updates fast for each new intake.",
    accent: "sand",
    ...serviceImage("social-media-post-design"),
  },
  {
    number: "04",
    name: "Financial Services",
    description:
      "XoomPlus turns complex figures into clear reports, dashboards and infographics. Charts highlight trends, risk and return without clutter. Plain labels, notes and sources keep compliance teams comfortable. Layouts work in board packs, investor pages and email updates.",
    accent: "ink",
    ...serviceImage("infographic-design"),
  },
  {
    number: "05",
    name: "Hospitality and Tourism",
    description:
      "We design menus, flyers and social ads that capture the spirit of your venue. Inviting visuals and vivid imagery inspire guests to book and share their experience.",
    accent: "steel",
    ...serviceImage("print-design"),
  },
];
