"use client";

import Link from "next/link";
import { useRef } from "react";

import Magnet from "@/components/ui/magnet";
import { InterfaceCraftsCards } from "@/components/ui/interface-crafts-cards";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  portfolioProjects,
  portfolioSectionCopy,
  type PortfolioProject,
} from "@/lib/data/portfolio";
import type { HomepagePortfolioCopy } from "@/lib/wordpress/types";
import { cn } from "@/lib/utils";

import styles from "./portfolio-section.module.css";

type PortfolioSectionProps = {
  className?: string;
  projects?: PortfolioProject[];
  copy?: HomepagePortfolioCopy;
};

/**
 * Portfolio — Aceternity Interface Crafts Cards fed by local TS data.
 */
export function PortfolioSection({
  className,
  projects,
  copy,
}: PortfolioSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const items = projects ?? portfolioProjects;
  const sectionCopy = copy ?? portfolioSectionCopy;

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
            {sectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{sectionCopy.title}</h2>
        </div>
        {sectionCopy.body ? (
          <p data-reveal className={styles.body}>
            {sectionCopy.body}
          </p>
        ) : null}
      </div>

      <div data-reveal className={styles.stage}>
        <InterfaceCraftsCards items={items} />
      </div>

      <div data-reveal className={styles.ctaWrap}>
        <Magnet padding={60} magnetStrength={3}>
          <Link
            href={sectionCopy.exploreCta.href}
            className="btn-primary"
          >
            {sectionCopy.exploreCta.label}
            <span aria-hidden className="translate-y-px text-[0.95em]">
              →
            </span>
          </Link>
        </Magnet>
      </div>
    </section>
  );
}
