import type { FaqItem } from "@/lib/data/faq";
import type { SectionCopy } from "@/lib/wordpress/types";

/**
 * Graphic Design Solutions FAQ — passed into the shared FaqSection.
 */
export const graphicDesignFaqCopy: SectionCopy = {
  eyebrow: "Design FAQs",
  title: "Questions brands ask before the first draft.",
  body: "Clarity on process, deliverables, and how graphic design fits the wider Xoomplus system.",
};

export const graphicDesignFaqItems: FaqItem[] = [
  {
    id: "gd-start",
    question: "How does a graphic design engagement start?",
    answer:
      "With a focused discovery call. We map the brand problem, constraints, and the outcome that makes the partnership worth it — then propose a clear scope and first sprint.",
  },
  {
    id: "gd-deliverables",
    question: "What do we actually receive?",
    answer:
      "Named, organized assets — logos, identity systems, social sets, UI kits, or print files — ready for production. You get the craft and the handoff, not a folder of mystery exports.",
  },
  {
    id: "gd-timeline",
    question: "How long does a typical design project take?",
    answer:
      "Brand systems often land in 6–10 weeks. Campaign and UI work varies with scope — we ship in phases so you see direction early, not after months of silence.",
  },
  {
    id: "gd-revisions",
    question: "How are revisions handled?",
    answer:
      "Weekly reviews inside the sprint. We tighten craft against the brief, not endless taste debates. Extra rounds can be scoped if the problem expands.",
  },
  {
    id: "gd-systems",
    question: "Do you build design systems or one-off pieces?",
    answer:
      "Both — but we prefer systems. Marks, type, and applications that stay consistent across UI, social, and print so the brand doesn’t fracture after launch.",
  },
  {
    id: "gd-fit",
    question: "Who is the best fit for Graphic Design Solutions?",
    answer:
      "Founders and marketing leads who want craft with commercial intent — startups ready to look grown-up, and established brands ready to move faster without looking generic.",
  },
];
