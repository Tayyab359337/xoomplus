"use client";

import { useRef } from "react";

import { HoverLift } from "@/components/animations/HoverLift";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { agencyMetrics } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

import styles from "./metrics-section.module.css";

type MetricsSectionProps = {
  className?: string;
};

/**
 * Agency metrics powered by Magic UI NumberTicker (viewport once).
 */
export function MetricsSection({ className }: MetricsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

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
            <SectionEyebrow className={styles.eyebrow}>
              By the numbers
            </SectionEyebrow>
            <h2 className={styles.title}>Proof, not promises.</h2>
          </div>
          <p className={styles.headerCopy}>
            Selected outcomes from partnerships across brand, product, and
            growth.
          </p>
        </div>

        <ul data-reveal-stagger className={styles.grid}>
          {agencyMetrics.map((metric, index) => (
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
