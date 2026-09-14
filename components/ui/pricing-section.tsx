"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import type {
  PricingBillingPeriod,
  PricingPlan,
  PricingSectionCopy,
} from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

import styles from "./pricing-section.module.css";

type PricingSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  plans: PricingPlan[];
  monthlyLabel?: string;
  yearlyLabel?: string;
  defaultBilling?: PricingBillingPeriod;
  className?: string;
  id?: string;
};

function formatPrice(
  value: number | string,
  currency = "£",
): string {
  if (typeof value === "string") return value;
  return `${currency}${value.toLocaleString("en-GB")}`;
}

function resolvePrice(
  plan: PricingPlan,
  billing: PricingBillingPeriod,
): { amount: string; suffix: string; savings?: string } {
  if (billing === "yearly") {
    return {
      amount: formatPrice(plan.yearlyPrice, plan.currency),
      suffix: plan.yearlySuffix ?? "/ year",
      savings: plan.yearlySavings,
    };
  }
  return {
    amount: formatPrice(plan.monthlyPrice, plan.currency),
    suffix: plan.monthlySuffix ?? "/ month",
  };
}

/**
 * Reusable pricing grid with Monthly / Yearly toggle.
 * Content is fully data-driven via `plans` + intro props.
 */
export function PricingSection({
  eyebrow,
  title,
  description,
  plans,
  monthlyLabel = "Monthly",
  yearlyLabel = "Yearly",
  defaultBilling = "monthly",
  className,
  id = "pricing",
}: PricingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [billing, setBilling] =
    useState<PricingBillingPeriod>(defaultBilling);

  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <header data-reveal className={styles.intro}>
          {eyebrow ? (
            <SectionEyebrow className={styles.eyebrow}>{eyebrow}</SectionEyebrow>
          ) : null}
          <h2 id={`${id}-heading`} className={styles.title}>
            {title}
          </h2>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </header>

        <div data-reveal className={styles.toggleWrap}>
          <div
            className={styles.toggle}
            role="group"
            aria-label="Billing period"
          >
            <button
              type="button"
              className={cn(
                styles.toggleBtn,
                billing === "monthly" && styles.toggleBtnActive,
              )}
              aria-pressed={billing === "monthly"}
              onClick={() => setBilling("monthly")}
            >
              {monthlyLabel}
            </button>
            <button
              type="button"
              className={cn(
                styles.toggleBtn,
                billing === "yearly" && styles.toggleBtnActive,
              )}
              aria-pressed={billing === "yearly"}
              onClick={() => setBilling("yearly")}
            >
              {yearlyLabel}
            </button>
          </div>
        </div>

        <div
          data-reveal-stagger
          className={styles.grid}
          role="list"
        >
          {plans.map((plan) => {
            const price = resolvePrice(plan, billing);
            const href = plan.buttonHref ?? "/appointment-booking/";
            const isHighlighted = Boolean(plan.highlighted);

            return (
              <article
                key={plan.id}
                role="listitem"
                className={cn(
                  styles.card,
                  isHighlighted && styles.cardHighlighted,
                )}
                aria-label={`${plan.name} plan`}
              >
                {plan.badge ? (
                  <span className={styles.badge}>{plan.badge}</span>
                ) : null}

                <h3 className={styles.name}>{plan.name}</h3>

                <div className={styles.priceRow}>
                  <span
                    key={`${plan.id}-${billing}`}
                    className={styles.price}
                    aria-live="polite"
                  >
                    {price.amount}
                  </span>
                  <span className={styles.suffix}>{price.suffix}</span>
                </div>

                {billing === "yearly" && price.savings ? (
                  <span className={styles.savings}>{price.savings}</span>
                ) : null}

                <p className={styles.cardDesc}>{plan.description}</p>

                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      <Check
                        aria-hidden
                        className={cn("size-3.5", styles.featureIcon)}
                        strokeWidth={2.25}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.ctaWrap}>
                  {isHighlighted ? (
                    <Link href={href} className={cn("btn-primary", styles.cta)}>
                      {plan.buttonLabel}
                    </Link>
                  ) : (
                    <Link
                      href={href}
                      className={cn("btn-ghost", styles.ctaSecondary)}
                    >
                      {plan.buttonLabel}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Convenience helper when passing a full copy object */
export function pricingCopyProps(copy: PricingSectionCopy) {
  return {
    eyebrow: copy.eyebrow,
    title: copy.title,
    description: copy.description,
    monthlyLabel: copy.monthlyLabel,
    yearlyLabel: copy.yearlyLabel,
  } as const;
}
