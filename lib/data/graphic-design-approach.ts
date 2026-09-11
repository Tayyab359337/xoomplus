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
 * Graphic Design Solutions — process stages.
 * Language mirrors FAQ / delivery cadence (discovery, scope, phases, reviews).
 */
export const graphicDesignApproachCopy = {
  eyebrow: "Our approach",
  title: "Intent first. Pixels second.",
  body: "A five-stage design rhythm — from discovery call to delivery — so the work stays sharp and the launch stays on time.",
} as const;

export const graphicDesignApproachStages: GraphicDesignApproachStage[] = [
  {
    number: "01",
    title: "Discover",
    description:
      "A focused discovery call — not a pitch deck. We map the brand problem, constraints, and the outcome that makes the partnership worth it.",
    ...serviceImage("brand-identity-design"),
  },
  {
    number: "02",
    title: "Define",
    description:
      "Clear scope, first sprint, and visual priorities. Hierarchy, audience, and deliverables locked before craft begins.",
    ...serviceImage("infographic-design"),
  },
  {
    number: "03",
    title: "Design",
    description:
      "Marks, layouts, and systems with editorial finish — type, color, and composition built to hold together across every touchpoint.",
    ...serviceImage("logo-design-service"),
  },
  {
    number: "04",
    title: "Refine",
    description:
      "Weekly reviews in phases. We tighten craft, stress-test applications, and cut anything that doesn’t earn its place.",
    ...serviceImage("website-ui-ux-design"),
  },
  {
    number: "05",
    title: "Deliver",
    description:
      "Campaign-ready assets and print-ready files — named, organized, and ready to ship without a second guess.",
    ...serviceImage("print-design"),
  },
];
