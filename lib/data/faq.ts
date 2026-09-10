export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Editable homepage FAQ — feed Accordion from this object only.
 */
export const faqItems: FaqItem[] = [
  {
    id: "engagement",
    question: "How do engagements usually start?",
    answer:
      "With a focused discovery call — not a 40-slide pitch. We map the problem, the constraints, and the outcome that would make the partnership worth it. If it's a fit, we propose a clear scope and a first sprint.",
  },
  {
    id: "timeline",
    question: "How long does a typical project take?",
    answer:
      "Brand systems often land in 6–10 weeks. Product and web builds vary with complexity — we ship in phases so you see progress early, not after months of silence.",
  },
  {
    id: "team",
    question: "Will we work with a dedicated team?",
    answer:
      "Yes. You get a small senior pod — strategy, design, and build — not a revolving cast of juniors. One point of contact, shared Slack or Notion, weekly reviews.",
  },
  {
    id: "retainers",
    question: "Do you offer ongoing retainers?",
    answer:
      "Many clients stay on after launch for growth, creative, and product iteration. Retainers are scoped around outcomes, not hours burned for the sake of it.",
  },
  {
    id: "remote",
    question: "Are you remote-only?",
    answer:
      "We're remote-first with optional on-sites for workshops and launches. Most of the craft happens asynchronously with sharp live sessions when decisions need to land.",
  },
  {
    id: "fit",
    question: "What kinds of clients are the best fit?",
    answer:
      "Founders and marketing leaders who care about craft and measurement — startups ready to look grown-up, and established brands ready to move faster without looking generic.",
  },
];

export const faqSectionCopy = {
  eyebrow: "Questions",
  title: "Straight answers before the kickoff.",
  body: "The things people ask before they trust a studio with something that matters.",
} as const;
