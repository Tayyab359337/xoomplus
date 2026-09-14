import type { WhyUsBentoItem } from "@/components/ui/why-us-bento";
import { graphicDesignSubServices } from "@/lib/data/graphic-design-sub-services";

/**
 * Why Choose Us — hardcoded from WordPress page 2417.
 * WP has three feature items; the remaining two bento cells use leftover sentences from the same section paragraph so the five-cell grid does not break.
 */
export const graphicDesignWhyUsCopy = {
  eyebrow: "Why Choose Us",
  title: "Why Choose Us",
  body: "At XoomPlus, we turn your brand into a visual story people remember. We learn your goals and share a clear plan you can follow. You see drafts early and guide each step with your feedback. The final designs fit your market and arrive ready to use everywhere.",
} as const;

/** Five bento panels — order matches the WhyUsBento grid layout. */
export const graphicDesignWhyUsItems: WhyUsBentoItem[] = [
  {
    id: "01",
    title: "Cohesive Brand Identity",
    description:
      "We bring every design element together so you look the same everywhere. From logos to flyers, we match colours, fonts and layouts. This helps customers spot your brand at a glance and trust what you offer.",
  },
  {
    id: "02",
    title: "Insight-Led Creativity",
    description:
      "We study your audience and check out your market to spark fresh ideas. Then we test sketches and mood boards until they feel right. The final visuals grab attention and make your message easy to understand.",
  },
  {
    id: "03",
    title: "Seamless Collaboration",
    description:
      "Your input guides every phase from initial sketch to final design. We share early drafts and clear check-ins so you always know how things are shaping up. Final files arrive with easy-to-follow usage notes and ready-to-use formats that keep your brand consistent.",
  },
  {
    id: "04",
    title: "A clear plan you can follow",
    description:
      "We learn your goals and share a clear plan you can follow. You see drafts early and guide each step with your feedback.",
  },
  {
    id: "05",
    title: "Ready to use everywhere",
    description:
      "The final designs fit your market and arrive ready to use everywhere.",
  },
];

/** Craft thumbs for the avatar stack — reuse GD service imagery. */
export const graphicDesignWhyUsAvatars = graphicDesignSubServices.map(
  (service) => service.image,
);
