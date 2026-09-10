"use client";

import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { aboutContent } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

import styles from "./about-section.module.css";

type AboutSectionProps = {
  className?: string;
};

/**
 * Editorial About — large statement, asymmetry, metadata.
 */
export function AboutSection({ className }: AboutSectionProps) {
  return (
    <section id="studio" className={cn(styles.section, className)}>
      <div aria-hidden className={styles.orb} />
      <div aria-hidden className={styles.accentLine} />

      <div className={styles.grid}>
        <div className={styles.aside}>
          <Reveal variant="fadeUp">
            <p className={styles.eyebrow}>{aboutContent.eyebrow}</p>
            <p className={styles.asideCopy}>Who we are when the deck is closed.</p>
          </Reveal>
        </div>

        <div className={styles.main}>
          <Reveal variant="fadeUp">
            <h2 className={styles.statement}>{aboutContent.statement}</h2>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.08}>
            <p className={styles.body}>{aboutContent.body}</p>
          </Reveal>

          <Stagger className={styles.metaRow}>
            {aboutContent.meta.map((item) => (
              <StaggerItem key={item.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{item.label}</span>
                <span className={styles.metaValue}>{item.value}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
