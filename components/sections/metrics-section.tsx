"use client";

import { useRef } from "react";

import { HoverLift } from "@/components/animations/HoverLift";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { agencyMetrics, type AgencyMetric } from "@/lib/data/homepage";
import type { SectionCopy } from "@/lib/wordpress/types";
import { cn } from "@/lib/utils";

import styles from "./metrics-section.module.css";

type MetricsSectionProps = {
  className?: string;
  metrics?: AgencyMetric[];
  copy?: SectionCopy;
  /** `banner` — teal case-studies band (About). Default keeps homepage cards. */
  variant?: "cards" | "banner";
  ariaLabel?: string;
};

/**
 * Agency metrics powered by Magic UI NumberTicker (viewport once).
 */
export function MetricsSection({
  className,
  metrics,
  copy,
  variant = "cards",
  ariaLabel = "Studio metrics",
}: MetricsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const items = (metrics ?? agencyMetrics).slice(0, 3);
  const isBanner = variant === "banner";

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      data-section-reveal
      className={cn(styles.section, isBanner && styles.banner, className)}
    >
      <div className={styles.inner}>
        <div data-reveal className={styles.header}>
          <div>
            {copy?.eyebrow ? (
              <SectionEyebrow
                showArrow={!isBanner}
                className={styles.eyebrow}
              >
                {copy.eyebrow}
              </SectionEyebrow>
            ) : null}
            <h2 className={styles.title}>
              {copy?.title || "Make Your Marketing More Effective"}
            </h2>
            {copy?.body ? (
              <p className={styles.headerCopy}>{copy.body}</p>
            ) : null}
          </div>
        </div>

        <ul data-reveal-stagger className={styles.grid}>
          {items.map((metric, index) => {
            const value = (
              <p className={styles.value}>
                {metric.prefix}
                <NumberTicker
                  value={metric.value}
                  decimalPlaces={metric.decimalPlaces ?? 0}
                  delay={0.05 * index}
                  className={cn(
                    styles.value,
                    isBanner && "text-inherit dark:text-inherit",
                  )}
                />
                {metric.suffix ? (
                  <span className={styles.suffix}>{metric.suffix}</span>
                ) : null}
              </p>
            );

            const inner = isBanner ? (
              <div className={styles.cardInner}>
                {value}
                <span className={styles.label}>{metric.label}</span>
              </div>
            ) : (
              <div className={styles.cardInner}>
                <span className={styles.label}>{metric.label}</span>
                <div>
                  {value}
                  {metric.hint ? (
                    <p className={styles.hint}>{metric.hint}</p>
                  ) : null}
                </div>
              </div>
            );

            return (
              <li key={metric.id} className={styles.card}>
                {isBanner ? (
                  inner
                ) : (
                  <HoverLift y={-3} scale={1.01} className={styles.cardHover}>
                    {inner}
                  </HoverLift>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
