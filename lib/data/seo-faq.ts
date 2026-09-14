import type { FaqItem } from "@/lib/data/faq";
import type { SectionCopy } from "@/lib/wordpress/types";

/**
 * SEO Services FAQ — hardcoded from WordPress page 3062.
 * "Quick answers" and "Business growth" are the WP tag labels, mapped into body like the homepage parser.
 */
export const seoFaqCopy: SectionCopy = {
  eyebrow: "FAQ's",
  title: "Let's make something awesome together",
  body: "Quick answers · Business growth",
};

export const seoFaqItems: FaqItem[] = [
  {
    id: "seo-all-types",
    question: "Does XoomPlus provide all types of SEO services?",
    answer:
      "Yes, XoomPlus provides a complete range of SEO services tailored to meet diverse business needs. Whether you are looking for foundational strategies like keyword research and technical audits, off-page SEO services such as link building, or local SEO services to boost visibility in specific regions, Xoomplus has you covered. Our holistic approach ensures that every aspect of search engine optimisation is taken into account so that your website performs well across all major search engines.",
  },
  {
    id: "seo-agency-vs-inhouse",
    question: "What distinguishes an SEO agency from in-house SEO?",
    answer:
      "An in-house SEO team usually involves hiring a dedicated employee or a small group within your company to manage ongoing search engine optimisation tasks. While this approach allows for direct oversight, it may lack the breadth of expertise and advanced tools available to a professional SEO agency. By contrast, outsourcing to an SEO agency like XoomPlus means you benefit from a team of specialists who bring years of experience, industry insights, and access to premium engine optimisation services.",
  },
  {
    id: "seo-agency-role",
    question: "What role does an SEO agency play?",
    answer:
      "An SEO agency plays a crucial role in enhancing your website's online presence. By delivering targeted SEO services, an agency helps increase organic traffic, improve search rankings, and drive qualified leads to your business. At XoomPlus, our goal is to implement tailored strategies that align with your objectives. Through effective search engine optimisation, we ensure your brand gains visibility in competitive markets, making it easier for customers to discover and trust your business.",
  },
];
