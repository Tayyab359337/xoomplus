export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  href: string;
  image: string;
  imageAlt: string;
  publishedAt?: string;
  readTime?: string;
};

/**
 * Editable homepage blog posts — homepage shows the latest 3.
 */
export const blogPosts: BlogPost[] = [
  {
    id: "quiet-brands",
    title: "Quiet brands win louder rooms",
    excerpt:
      "Why restraint, pacing, and material honesty outperform the loudest launch campaign.",
    category: "Brand",
    href: "/blog/quiet-brands",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Abstract textured composition in muted tones",
    publishedAt: "Mar 12, 2026",
    readTime: "6 min",
  },
  {
    id: "systems-not-pages",
    title: "Ship systems, not pages",
    excerpt:
      "A product site is a decision engine. Design the paths, not the poster.",
    category: "Product",
    href: "/blog/systems-not-pages",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138eafea?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Designer reviewing interface layouts on a desk",
    publishedAt: "Feb 28, 2026",
    readTime: "8 min",
  },
  {
    id: "growth-without-gimmicks",
    title: "Growth without the gimmicks",
    excerpt:
      "Performance creative that respects the brand — and still moves the number.",
    category: "Growth",
    href: "/blog/growth-without-gimmicks",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Laptop showing analytics charts on a wooden table",
    publishedAt: "Feb 4, 2026",
    readTime: "5 min",
  },
  {
    id: "editorial-web",
    title: "The case for editorial web",
    excerpt:
      "Typography, asymmetry, and motion as meaning — not decoration bolted on later.",
    category: "Craft",
    href: "/blog/editorial-web",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Open notebook with handwritten notes and a pen",
    publishedAt: "Jan 18, 2026",
    readTime: "7 min",
  },
];

/** Homepage journal strip — latest three posts only. */
export const latestBlogPosts = blogPosts.slice(0, 3);

export const blogsSectionCopy = {
  eyebrow: "Journal",
  title: "Notes from the studio floor.",
  body: "Thinking on brand, product, and growth — written the way we work.",
  viewAll: {
    label: "All writing",
    href: "/blog",
  },
} as const;
