export type WebSolutionsSubService = {
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  href: string;
};

export type WebSolutionsHeroCopy = {
  eyebrow: string;
  headline: string;
  body: string;
};

export type WebSolutionsServicesIntro = {
  eyebrow: string;
  title: string;
  body: string;
};

export const webSolutionsFallbackHero: WebSolutionsHeroCopy = {
  eyebrow: "Web Solutions",
  headline: "Web solutions built to move your business forward",
  body: "From custom websites and ecommerce stores to WordPress, Shopify, hosting, and ongoing support, we build digital foundations that help businesses grow.",
};

export const webSolutionsSubServicesCopy: WebSolutionsServicesIntro = {
  eyebrow: "Our Web Services",
  title: "Everything your website needs to perform",
  body: "Explore practical web solutions for launching, improving, and supporting the digital experience your customers rely on.",
};

export const webSolutionsSubServices: WebSolutionsSubService[] = [
  {
    title: "Ecommerce Website Development",
    description: "Conversion-focused online stores with secure checkout and a smoother shopping experience.",
    category: "Commerce",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Ecommerce interface on a tablet",
    href: "/web-solutions/ecommerce-website-development/",
  },
  {
    title: "WordPress Development",
    description: "Flexible WordPress websites that combine bespoke design with manageable content tools.",
    category: "CMS",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Website analytics and content workspace",
    href: "/web-solutions/wordpress-development/",
  },
  {
    title: "Custom Website Development",
    description: "Bespoke websites engineered for performance, security, and future expansion.",
    category: "Engineering",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer workspace with code on screen",
    href: "/web-solutions/custom-website-development/",
  },
  {
    title: "Shopify Store Development",
    description: "Distinctive Shopify storefronts with tailored themes, integrations, and fast product pages.",
    category: "Storefront",
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Products arranged for an online storefront",
    href: "/web-solutions/shopify-store-development/",
  },
  {
    title: "Website Maintenance & Support",
    description: "Ongoing updates, security, fixes, and technical care after your website goes live.",
    category: "Care & SLA",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Technical monitoring and maintenance workspace",
    href: "/web-solutions/website-maintenance-and-support/",
  },
  {
    title: "Hosting & Domain Management",
    description: "Dependable hosting and domain support for a stable, secure, and fast website foundation.",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Cloud server infrastructure",
    href: "/web-solutions/website-hosting-and-domain-management/",
  },
];

export const webSolutionsTechnologies = [
  { name: "Next.js", icon: "next", orbit: 1 },
  { name: "Node.js", icon: "node", orbit: 1 },
  { name: "WordPress", icon: "wordpress", orbit: 1 },
  { name: "Laravel", icon: "laravel", orbit: 1 },
  { name: "Express.js", icon: "express", orbit: 2 },
  { name: "PostgreSQL", icon: "postgresql", orbit: 2 },
  { name: "Prisma", icon: "prisma", orbit: 2 },
  { name: "Shopify", icon: "shopify", orbit: 2 },
  { name: "Firebase", icon: "firebase", orbit: 3 },
  { name: "MongoDB", icon: "mongodb", orbit: 3 },
  { name: "Supabase", icon: "supabase", orbit: 3 },
  { name: "Cloudflare R2 Storage", icon: "cloudflare", orbit: 3 },
] as const;

export const webSolutionsApproachStages = [
  { number: "01", title: "Discovery / Strategy", description: "We clarify the audience, goals, content, and technical needs that shape the build." },
  { number: "02", title: "Planning", description: "The scope, platform, structure, and delivery route become a clear plan for the project." },
  { number: "03", title: "UX / UI", description: "We turn the strategy into an interface that is easy to understand and unmistakably yours." },
  { number: "04", title: "Development", description: "The chosen platform is built with responsive behaviour, performance, and maintenance in mind." },
  { number: "05", title: "Testing", description: "We check the experience across devices and interactions before it reaches customers." },
  { number: "06", title: "Launch / Growth", description: "The finished foundation is ready to support improvements and future growth after launch." },
] as const;
