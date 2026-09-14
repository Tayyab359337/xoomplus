import type { FaqItem } from "@/lib/data/faq";
import type { SectionCopy } from "@/lib/wordpress/types";

/**
 * Graphic Design Solutions FAQ — hardcoded from WordPress page 2417.
 */
export const graphicDesignFaqCopy: SectionCopy = {
  eyebrow: "FAQs",
  title: "FAQs",
  body: "",
};

export const graphicDesignFaqItems: FaqItem[] = [
  {
    id: "gd-turnaround",
    question: "What is your typical turnaround time?",
    answer:
      "Most logo projects are ready in 5–7 business days. Brand identity kits usually take 1–2 weeks. Larger campaigns or multi-asset jobs can take 2–4 weeks, depending on scope.",
  },
  {
    id: "gd-revisions",
    question: "How many revisions are included?",
    answer:
      "We include up to three rounds of revisions at no extra cost. After that, you can request further tweaks for a small fee or as part of a tailored support plan.",
  },
  {
    id: "gd-formats",
    question: "What file formats do I receive?",
    answer:
      "You'll get print-ready vector files (AI, EPS, PDF) plus web-optimized versions (PNG, JPEG). Layered source files and a PDF style guide are also included for easy updates.",
  },
  {
    id: "gd-consistency",
    question: "How do you keep my brand consistent?",
    answer:
      "Every project follows a clear style guide with approved colors, fonts and layout rules. This ensures all assets, from social posts to brochures, share the same look and feel.",
  },
  {
    id: "gd-quote",
    question: "How can I get a custom quote?",
    answer:
      "Simply fill out our online request form or send us a brief description of your needs. We'll review your project and send a clear, no-obligation estimate within one business day.",
  },
];
