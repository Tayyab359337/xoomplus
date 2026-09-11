"use client";

import Link from "next/link";
import { useRef } from "react";

import { Magnetic } from "@/components/animations/Magnetic";
import { InterfaceCraftsCards } from "@/components/ui/interface-crafts-cards";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
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
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Portfolio"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.header}>
        <div data-reveal>
          <SectionEyebrow className={styles.eyebrow}>
            {portfolioSectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{portfolioSectionCopy.title}</h2>
        </div>
        <p data-reveal className={styles.body}>
          {portfolioSectionCopy.body}
        </p>
      </div>

      <div data-reveal className={styles.stage}>
        <InterfaceCraftsCards items={portfolioProjects} />
      </div>

      <div data-reveal className={styles.ctaWrap}>
        <Magnetic strength={0.22}>
          <Link
            href={portfolioSectionCopy.exploreCta.href}
            className="btn-primary"
          >
            {portfolioSectionCopy.exploreCta.label}
            <span aria-hidden className="translate-y-px text-[0.95em]">
              →
            </span>
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
