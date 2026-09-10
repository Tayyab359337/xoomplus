"use client";

import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { InterfaceCraftsCards } from "@/components/ui/interface-crafts-cards";
import {
  portfolioProjects,
  portfolioSectionCopy,
} from "@/lib/data/portfolio";
import { cn } from "@/lib/utils";

import styles from "./portfolio-section.module.css";

type PortfolioSectionProps = {
  className?: string;
};

/**
 * Portfolio — Aceternity Interface Crafts Cards fed by local TS data.
 */
export function PortfolioSection({ className }: PortfolioSectionProps) {
  return (
    <section
      id="work"
      aria-label="Portfolio"
      className={cn(styles.section, className)}
    >
      <div className={styles.header}>
        <Reveal variant="fadeUp">
          <p className={styles.eyebrow}>{portfolioSectionCopy.eyebrow}</p>
          <h2 className={styles.title}>{portfolioSectionCopy.title}</h2>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.06}>
          <p className={styles.body}>{portfolioSectionCopy.body}</p>
        </Reveal>
      </div>

      <Reveal variant="fadeUp" delay={0.1} className={styles.stage}>
        <InterfaceCraftsCards items={portfolioProjects} />
      </Reveal>

      <Reveal variant="fadeUp" delay={0.14} className={styles.ctaWrap}>
        <Link
          href={portfolioSectionCopy.exploreCta.href}
          className={styles.explore}
        >
          {portfolioSectionCopy.exploreCta.label}
        </Link>
      </Reveal>
    </section>
  );
}
