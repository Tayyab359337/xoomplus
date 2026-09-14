import type { HomepageCta } from "@/lib/wordpress/types";

const HERO_IMAGE =
  "https://xoomplus.co.uk/wp-content/uploads/2025/08/seo-services.webp";

/**
 * SEO Services CTA — hardcoded from WordPress page 3062.
 * WP has one button; secondary still targets this page's process section so the existing two-action layout stays intact.
 */
export const seoCtaCopy: HomepageCta = {
  eyebrow: "Contact US",
  title: "Join us! And be visible where it matters. Your customers are looking for you.",
  body: "Get discovered by the right audience using SEO, at the right time.",
  primaryCta: {
    label: "Talk to a Specialist",
    href: "/#contact",
  },
  secondaryCta: {
    label: "See our process",
    href: "#seo-process",
  },
  image: {
    src: HERO_IMAGE,
    alt: "SEO Service",
  },
};
