export type GraphicDesignShowcaseCopy = {
  eyebrow: string;
  title: string;
  body: string;
  cta: {
    label: string;
    href: string;
  };
};

/**
 * Editable Flying Posters image set for Graphic Design showcase.
 * Prefer portrait-friendly creative work imagery (verified reachable URLs).
 */
export const graphicDesignShowcaseImages: string[] = [
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=80",
];

export const graphicDesignShowcaseCopy: GraphicDesignShowcaseCopy = {
  eyebrow: "Selected design work",
  title: "Work that looks expensive before you read a word.",
  body: "A gallery of marks, campaigns, and visual systems — the kind of craft clients feel before they can explain it.",
  cta: {
    label: "View full portfolio",
    href: "/projects/",
  },
};
