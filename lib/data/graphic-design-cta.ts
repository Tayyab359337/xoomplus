import type { HomepageCta } from "@/lib/wordpress/types";

/**
 * Graphic Design Solutions CTA — hardcoded from WordPress page 2417.
 * WP has one button; secondary still targets this page's approach section so the existing two-action layout stays intact.
 */
export const graphicDesignCtaCopy: HomepageCta = {
  eyebrow: "Contact US",
  title: "Ready to Transform Your Brand? Book Your Graphic Design Consultation",
  body: "XoomPlus delivers expert graphic design services that make your brand unforgettable.",
  primaryCta: {
    label: "Talk to a Specialist",
    href: "/#contact",
  },
  secondaryCta: {
    label: "See our approach",
    href: "#approach",
  },
  image: {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    alt: "Creative team collaborating around a studio table",
  },
};
