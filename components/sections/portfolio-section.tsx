"use client";

import Link from "next/link";

import { InterfaceCraftsCards } from "@/components/ui/interface-crafts-cards";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
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
        <div data-motion="fade-up">
          <SectionEyebrow className={styles.eyebrow}>
            {portfolioSectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{portfolioSectionCopy.title}</h2>
        </div>
        <p
          data-motion="fade-up"
          data-motion-delay="0.06"
          className={styles.body}
        >
          {portfolioSectionCopy.body}
        </p>
      </div>

      <div
        data-motion="scale"
        data-motion-delay="0.1"
        className={styles.stage}
      >
        <InterfaceCraftsCards items={portfolioProjects} />
      </div>

      <div
        data-motion="fade-up"
        data-motion-delay="0.14"
        className={styles.ctaWrap}
      >
        <Link
          href={portfolioSectionCopy.exploreCta.href}
          className="btn-primary"
        >
          {portfolioSectionCopy.exploreCta.label}
          <span aria-hidden className="translate-y-px text-[0.95em]">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
