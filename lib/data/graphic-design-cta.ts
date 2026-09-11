import type { HomepageCta } from "@/lib/wordpress/types";

/**
 * Graphic Design Solutions CTA — passed into ProfessionalCtaSection.
 * Links target homepage contact + this page’s approach section.
 */
export const graphicDesignCtaCopy: HomepageCta = {
  eyebrow: "Start here",
  title: "Bring the brief you're nervous to send.",
  body: "The half-finished identity. The campaign that looks expensive but feels average. Tell us what’s unresolved — we’ll tell you how we’d begin.",
  primaryCta: {
    label: "Start a conversation",
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
