export type PricingBillingPeriod = "monthly" | "yearly";

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  /** Numeric amount or display string (e.g. "Custom") */
  monthlyPrice: number | string;
  yearlyPrice: number | string;
  currency?: string;
  monthlySuffix?: string;
  yearlySuffix?: string;
  /** Optional savings label shown in yearly mode */
  yearlySavings?: string;
  features: string[];
  buttonLabel: string;
  buttonHref?: string;
  highlighted?: boolean;
  badge?: string;
};

export type PricingSectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
};
