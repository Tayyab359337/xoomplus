export type SeoProcessVisualId =
  | "audit"
  | "technical"
  | "content"
  | "monitoring";

export type SeoProcessStep = {
  number: string;
  title: string;
  phase: string;
  description: string;
  visual: SeoProcessVisualId;
};

/**
 * Four-step SEO delivery process — hardcoded from WordPress page 3062.
 * Visuals stay on the existing SVG icons in the section.
 */
export const seoProcessSteps: SeoProcessStep[] = [
  {
    number: "01",
    title: "SEO Audit & Strategy",
    phase: "Audit",
    description:
      "We start by checking your website all over. We determine your current rank and that of your rivals. We assess your target audience. Then devise a clear plan taking into account keywords, rank, intent and audience focus.",
    visual: "audit",
  },
  {
    number: "02",
    title: "Technical Optimisation",
    phase: "Fix",
    description:
      "Technicalities are very important. We run a check through your site, looking for broken links, crawl errors, slow speed and spam. We fix these and look for ways to enhance speed and visibility. Either minor tweaks or major changes. We make sure that no technical issues get in the way of good SEO services.",
    visual: "technical",
  },
  {
    number: "03",
    title: "Content & On-Page SEO",
    phase: "Pages",
    description:
      "Our content is optimised for ranking. We write the best blogs with the best content writers out there. That's our speciality. Our content has strong titles, meta tags and smart linking across the board. Making sure no page remains unoptimised. Our content optimisation boosts your SEO.",
    visual: "content",
  },
  {
    number: "04",
    title: "Monitoring & Continuous Improvement",
    phase: "Iterate",
    description:
      "SEO is a continuous process. It never ends. We review and revise each strategy with changes in algorithms. Our SEO services get reinforced with each change. We track your growth and update to match Google's changes. That way our SEO services remain up to date and on top.",
    visual: "monitoring",
  },
];

export const seoProcessCopy = {
  eyebrow: "Our process",
  title: "How Our SEO Process Works",
  body: "We have a process that is both simple yet strategic. We believe in data and facts. Guesswork is not our forte. Our data driven approach combined with AI driven capabilities, make our process both smooth and efficient. Our SEO service in the UK adapts to every algorithm in the UK so you never stay behind. We mix technical elements with creative aspects so stone is left unturned in our SEO expertise. Here is an outline of our strong and strategic approach.",
} as const;
