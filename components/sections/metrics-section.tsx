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
};

/**
 * Agency metrics powered by Magic UI NumberTicker (viewport once).
 */
export function MetricsSection({
  className,
  metrics,
  copy,
}: MetricsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const items = (metrics ?? agencyMetrics).slice(0, 3);

  return (
    <section
      ref={sectionRef}
      aria-label="Studio metrics"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.inner}>
        <div data-reveal className={styles.header}>
          <div>
            {copy?.eyebrow ? (
              <SectionEyebrow className={styles.eyebrow}>
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
          {items.map((metric, index) => (
            <li key={metric.id} className={styles.card}>
              <HoverLift y={-3} scale={1.01} className={styles.cardHover}>
                <div className={styles.cardInner}>
                  <span className={styles.label}>{metric.label}</span>
                  <div>
                    <p className={styles.value}>
                      {metric.prefix}
                      <NumberTicker
                        value={metric.value}
                        decimalPlaces={metric.decimalPlaces ?? 0}
                        delay={0.05 * index}
                        className={styles.value}
                      />
                      {metric.suffix ? (
                        <span className={styles.suffix}>{metric.suffix}</span>
                      ) : null}
                    </p>
                    {metric.hint ? (
                      <p className={styles.hint}>{metric.hint}</p>
                    ) : null}
                  </div>
                </div>
              </HoverLift>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
