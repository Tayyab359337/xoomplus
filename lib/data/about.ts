import type { WhyUsBentoItem } from "@/components/ui/why-us-bento";
import { WP_ORIGIN } from "@/lib/wordpress/config";

const MEDIA = `${WP_ORIGIN}/wp-content/uploads`;

export const aboutHeroCopy = {
  homeLabel: "Home",
  homeHref: "/",
  currentLabel: "About Us",
  heading: "About Xoomplus",
} as const;

export const aboutExpertiseCopy = {
  eyebrow: "Our Expertise & Impact",
  title: "Our Expertise & Impact",
  body: "Xoomplus combines strategy, creativity, technology, SEO and digital marketing to create measurable business growth.",
} as const;

export const aboutExpertiseMetrics = [
  {
    id: "client-satisfaction",
    label: "Client Satisfaction",
    value: 90,
    suffix: "%",
  },
  {
    id: "project-success",
    label: "Project Success Rate",
    value: 90,
    suffix: "%",
  },
] as const;

export const aboutWorkCopy = {
  eyebrow: "Case Studies",
  title: "Make your marketing more effective",
  body: "",
} as const;

export const aboutCaseVideo = {
  src: `${MEDIA}/2025/08/Xoom-About-Us-video.webm`,
  thumbnailSrc: `${MEDIA}/2025/08/about-us-thumbnail.webp`,
  thumbnailAlt: "Xoomplus about us case study video",
  title: "Xoomplus case study video",
} as const;

export const aboutWhyUsCopy = {
  eyebrow: "WHY Choose us",
  title: "Why Choose Xoomplus",
  body: "We deliver creative, data-driven, and result-oriented digital solutions that help brands grow faster, stand out online, and achieve long-term success.",
} as const;

export const aboutWhyUsItems: WhyUsBentoItem[] = [
  {
    id: "01",
    title: "Proven Expertise",
    description:
      "With years of experience in digital marketing, web development, and design.",
  },
  {
    id: "02",
    title: "Custom Solutions",
    description:
      "We craft tailored strategies to match your business goals, ensuring the highest impact possible.",
  },
  {
    id: "03",
    title: "Measurable Results",
    description:
      "We design ROI-focused campaigns that increase traffic, generate leads, and drive sales growth.",
  },
  {
    id: "04",
    title: "Grow faster, stand out online",
    description:
      "We deliver creative, data-driven, and result-oriented digital solutions that help brands grow faster.",
  },
  {
    id: "05",
    title: "Long-term success",
    description:
      "Stand out online, and achieve long-term success with a partner focused on growth that lasts.",
  },
];

export const aboutWhyUsAvatars = [
  `${MEDIA}/2025/08/about-us-thumbnail.webp`,
  `${MEDIA}/2025/09/about-rocket.webp`,
  `${MEDIA}/2025/08/marketing-cta.webp`,
  `${MEDIA}/2024/11/feature-img.png`,
  `${MEDIA}/2025/08/seo-services.webp`,
];

export const aboutSuccessCopy = {
  eyebrow: "Success Stories",
  title: "Success Stories That Inspire Growth",
  primaryValue: 500,
  primarySuffix: "+",
  primaryBody: "Delivering strategies that boost traffic, leads, and revenue.",
  clientsLabel: "Happy Clients",
  secondaryValue: 2,
  secondarySuffix: "k+",
  secondaryBody: "Building long-term",
  rocketSrc: `${MEDIA}/2025/09/about-rocket.webp`,
} as const;
