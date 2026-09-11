import type { AgencyMetric, PartnerLogo } from "@/lib/data/homepage";
import type { BlogPost } from "@/lib/data/blogs";
import type { FaqItem } from "@/lib/data/faq";
import type { PortfolioProject } from "@/lib/data/portfolio";
import type { ServiceCategory } from "@/lib/data/services";
import type { Testimonial } from "@/lib/data/testimonials";

export type HomepageAbout = {
  index: string;
  eyebrow: string;
  intro: string;
  statementLines: readonly string[] | string[];
  body: string;
  meta: ReadonlyArray<{ label: string; value: string }> | Array<{ label: string; value: string }>;
  cta: { label: string; href: string };
  image: { src: string; alt: string } | null;
};

export type HomepageCta = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: { src: string; alt: string };
};

export type HomepageFooter = {
  tagline: string;
  wordmark: string;
  navigation: Array<{ label: string; href: string }>;
  services: Array<{ label: string; href: string }>;
  social: Array<{ label: string; href: string }>;
  contact: {
    email: string;
    phone: string;
    addressLines: string[];
  };
  legal: Array<{ label: string; href: string }>;
  copyrightName: string;
};

export type SectionCopy = {
  eyebrow: string;
  title: string;
  body: string;
};

export type HomepageBlogsCopy = SectionCopy & {
  viewAll: { label: string; href: string };
};

export type HomepagePortfolioCopy = SectionCopy & {
  exploreCta: { label: string; href: string };
};

export type HomepageLogosCopy = {
  eyebrow: string;
  title?: string;
  body?: string;
};

export type HomepageContent = {
  logos: PartnerLogo[];
  logosCopy: HomepageLogosCopy;
  about: HomepageAbout;
  metrics: AgencyMetric[];
  metricsCopy: SectionCopy;
  services: ServiceCategory[];
  servicesCopy: SectionCopy;
  portfolio: PortfolioProject[];
  portfolioCopy: HomepagePortfolioCopy;
  faqs: FaqItem[];
  faqsCopy: SectionCopy;
  cta: HomepageCta;
  testimonials: Testimonial[];
  testimonialsCopy: SectionCopy;
  blogs: BlogPost[];
  blogsCopy: HomepageBlogsCopy;
  contactCopy: SectionCopy;
  footer: HomepageFooter;
};
