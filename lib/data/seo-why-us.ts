import type { WhyUsBentoItem } from "@/components/ui/why-us-bento";

const HERO_IMAGE =
  "https://xoomplus.co.uk/wp-content/uploads/2025/08/seo-services.webp";

/**
 * Why Choose XoomPlus — hardcoded from WordPress page 3062.
 * WP has three feature items; the remaining two bento cells use leftover sentences from the same section paragraph so the five-cell grid does not break.
 */
export const seoWhyUsCopy = {
  eyebrow: "WHY Choose us",
  title: "Why Choose XoomPlus?",
  body: "SEO is about competition. Without our engine optimisation services, your rivals rank higher everyday. We can change that. With XoomPlus, our SEO Services help you win back the customers you are currently losing. We will make sure that you are visible. Then turn this visibility into revenue. Focusing on growth and traffic that converts. Here is why you should join us:",
} as const;

/** Five bento panels — order matches the WhyUsBento grid layout. */
export const seoWhyUsItems: WhyUsBentoItem[] = [
  {
    id: "01",
    title: "ROI-Focused Strategy",
    description:
      "Focus is key. Our strategy focuses on growth, rank, traffic and conversions. We don't focus on vanity metrics. We zone in on areas that maximise your ROI. Our reports are short, precise and to the point. So you know exactly what investment is paying off.",
  },
  {
    id: "02",
    title: "Updated SEO Workflow",
    description:
      "Search engines' algorithms update all the time. So do we. What works today may not work tomorrow. As an SEO agency we stay ahead by evolving strategies with the algorithm changes.",
  },
  {
    id: "03",
    title: "Partnership Approach",
    description:
      "To us, you are not just an account. Your wins and losses are ours. That's why our team gives clear insights and precise reports. You get quick replies and timely feedback. You will have full access to our team and no hurdles in communication. At no point will we ever feel like outsiders. Our approach is that of trusted partners.",
  },
  {
    id: "04",
    title: "Win back the customers you are losing",
    description:
      "With XoomPlus, our SEO Services help you win back the customers you are currently losing. We will make sure that you are visible.",
  },
  {
    id: "05",
    title: "Visibility that turns into revenue",
    description:
      "Then turn this visibility into revenue. Focusing on growth and traffic that converts.",
  },
];

/** Decorative WP hero/OG image for the avatar stack. */
export const seoWhyUsAvatars = [
  HERO_IMAGE,
  HERO_IMAGE,
  HERO_IMAGE,
  HERO_IMAGE,
  HERO_IMAGE,
];
