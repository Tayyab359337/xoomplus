"use client";

import Image from "next/image";
import { useRef } from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { aboutSuccessCopy } from "@/lib/data/about";
import { cn } from "@/lib/utils";

import styles from "./about-success.module.css";

type AboutSuccessProps = {
  className?: string;
};

/**
 * Success stories — oversized 500+ anchor, not a statistic card grid.
 */
export function AboutSuccess({ className }: AboutSuccessProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="success"
      aria-labelledby="success-heading"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <header data-reveal className={styles.intro}>
          <SectionEyebrow>{aboutSuccessCopy.eyebrow}</SectionEyebrow>
          <h2 id="success-heading" className={styles.title}>
            {aboutSuccessCopy.title}
          </h2>
        </header>

        <div className={styles.composition}>
          <div data-reveal className={styles.anchor}>
            <p className={styles.giant}>
              <NumberTicker
                value={aboutSuccessCopy.primaryValue}
                className={styles.giantTicker}
              />
              <span className={styles.giantSuffix}>
                {aboutSuccessCopy.primarySuffix}
              </span>
            </p>
            <p className={styles.primaryBody}>{aboutSuccessCopy.primaryBody}</p>
            <div className={styles.rocket} aria-hidden>
              <Image
                src={aboutSuccessCopy.rocketSrc}
                alt=""
                width={333}
                height={291}
                sizes="(max-width: 768px) 140px, 220px"
                className={styles.rocketImage}
                loading="lazy"
              />
            </div>
          </div>

          <aside data-reveal className={styles.aside}>
            <p className={styles.clients}>{aboutSuccessCopy.clientsLabel}</p>
            <p className={styles.secondary}>
              <NumberTicker
                value={aboutSuccessCopy.secondaryValue}
                delay={0.12}
                className={styles.secondaryTicker}
              />
              <span className={styles.secondarySuffix}>
                {aboutSuccessCopy.secondarySuffix}
              </span>
            </p>
            <p className={styles.secondaryBody}>
              {aboutSuccessCopy.secondaryBody}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
