import { graphicDesignSubServices } from "@/lib/data/graphic-design-sub-services";

export type GraphicDesignApproachStage = {
  number: string;
  title: string;
  description: string;
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

/**
 * Graphic Design Solutions — process stages from WordPress page 2417.
 * WP lists four numbered steps; the fifth slot is the trials/feedback line from the same section intro so the existing five-stage layout stays intact.
 */
export const graphicDesignApproachCopy = {
  eyebrow: "Our Approach",
  title: "Our Approach to Crafting Visual Identities",
  body: "XoomPlus reviews your brand's values and strengths to understand what makes it unique. Next, we analyse your target market and audience so every design choice speaks directly to their needs. Then XoomPlus uses market research, quick design trials, and your feedback to craft a look that fits. Here's the simple process we follow:",
} as const;

export const graphicDesignApproachStages: GraphicDesignApproachStage[] = [
  {
    number: "01",
    title: "Discovery & Research",
    description:
      "We begin by studying your field, checking competitors' designs, and gathering insights from your target audience. This gives clear direction for every design choice. XoomPlus conducts interviews, competitive reviews, and audience profiling.",
    ...serviceImage("brand-identity-design"),
  },
  {
    number: "02",
    title: "Concept Development",
    description:
      "Initial ideas come to life through sketches and mood boards. XoomPlus explores multiple directions, testing colors, layouts, and styles.",
    ...serviceImage("infographic-design"),
  },
  {
    number: "03",
    title: "Design Execution",
    description:
      "Turning concepts into polished assets requires attention to detail. XoomPlus uses professional tools to produce high-resolution mockups and iterates until every element is on point.",
    ...serviceImage("logo-design-service"),
  },
  {
    number: "04",
    title: "Trials & Feedback",
    description:
      "Then XoomPlus uses market research, quick design trials, and your feedback to craft a look that fits.",
    ...serviceImage("website-ui-ux-design"),
  },
  {
    number: "05",
    title: "Delivery & Ongoing Support",
    description:
      "A true partnership continues after launch. XoomPlus hands over source files, provides clear usage notes, and stands by for updates or new asset requests.",
    ...serviceImage("print-design"),
  },
];
