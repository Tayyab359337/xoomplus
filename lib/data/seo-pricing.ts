import type { PricingPlan, PricingSectionCopy } from "@/lib/data/pricing";

const CONTACT_HREF = "/#contact";

/**
 * SEO pricing — hardcoded from WordPress page 3062 packages.
 * WP lists monthly rates; yearly amounts keep this layout's 2-months-free billing toggle.
 */
export const seoPricingCopy: PricingSectionCopy = {
  eyebrow: "Flexible plans",
  title: "Flexible Plans for Every Stage of Growth",
  description:
    "Choose a pricing plan that fits your needs. We offer you value and support through our flexible plans, whether you are just starting out or scaling up. Choose our monthly and yearly options based on your needs. Switch or upgrade when you feel the business has grown.",
  monthlyLabel: "Monthly",
  yearlyLabel: "Yearly",
};

export const seoPricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    currency: "£",
    monthlySuffix: "/ month",
    yearlySuffix: "/ year",
    yearlySavings: "2 months free",
    buttonLabel: "Get Started Now",
    buttonHref: CONTACT_HREF,
    features: [
      "1x SEO Audit Report",
      "3x Keyword Research",
      "2x Blog Title Research",
      "2x On-Page SEO for up to 2 pages",
      "1x Technical SEO Issue Fix",
      "1x Basic Schema Markup",
      "1x Competitor Analysis (Lite)",
      "1x Monthly SEO Report",
      "1x Social Bookmarking Backlink",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "",
    monthlyPrice: 499,
    yearlyPrice: 4990,
    currency: "£",
    monthlySuffix: "/ month",
    yearlySuffix: "/ year",
    yearlySavings: "2 months free",
    highlighted: true,
    badge: "Most popular",
    buttonLabel: "Get Started Now",
    buttonHref: CONTACT_HREF,
    features: [
      "Full SEO Audit Report",
      "8x Keyword Research",
      "5x Blog Title Research",
      "5x On-Page SEO Pages",
      "3x Technical Issues Fixes",
      "2x Basic Schema Markups",
      "1x Schema Audit and Fix",
      "2x Competitor Analysis",
      "3x Social Bookmarking + 1x Citation + 1x Guest Post",
      "Google My Business Management",
      "1x Monthly Report + Analytics Monitoring",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    description: "",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    currency: "£",
    monthlySuffix: "/ month",
    yearlySuffix: "/ year",
    yearlySavings: "2 months free",
    buttonLabel: "Get Started Now",
    buttonHref: CONTACT_HREF,
    features: [
      "Full Technical SEO Audit",
      "15x Keywords + 10x Blog Title Research",
      "10x On-Page SEO Pages",
      "6x Technical SEO Fixes",
      "5x Schema Markups + 1x Audit",
      "3x Competitor Analysis",
      "5x Citations + 3x Guest Posts + 5x Social Bookmarks",
      "Google Analytics + GMB Management",
      "2x Monthly Reports + Weekly Mini Audits",
    ],
  },
];
