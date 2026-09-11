"use client";

import Link from "next/link";

import { Magnetic } from "@/components/animations/Magnetic";
import { ScrollExpand } from "@/components/scroll-expand";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useMediaQuery } from "@/hooks/use-media-query";
import { professionalCtaCopy } from "@/lib/data/cta";
import { cn } from "@/lib/utils";

import styles from "./professional-cta-section.module.css";

type ProfessionalCtaSectionProps = {
  className?: string;
};

/**
 * Professional CTA — ScrollExpand crescendo + restrained GSAP entrance.
 */
export function ProfessionalCtaSection({
  className,
}: ProfessionalCtaSectionProps) {
  const copy = professionalCtaCopy;
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section
      id="start"
      aria-label="Start a project"
      data-motion="fade-up"
      className={cn(styles.section, className)}
    >
      <ScrollExpand
        src={copy.image.src}
        alt={copy.image.alt}
        title={copy.title}
        scrollHint="Scroll"
        useWindowScroll
        startWidth={isMobile ? 68 : 42}
        startHeight={isMobile ? 52 : 58}
        startRadius={4}
        endRadius={0}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.35}
        overlayScrim={0.72}
        className={styles.expand}
      >
        <SectionEyebrow data-motion="fade-up" className={styles.eyebrow}>
          {copy.eyebrow}
        </SectionEyebrow>
        <h2 data-motion="clip" className={styles.overlayTitle}>
          {copy.title}
        </h2>
        <p data-motion="fade-up" data-motion-delay="0.08" className={styles.body}>
          {copy.body}
        </p>
        <div
          data-motion="fade-up"
          data-motion-delay="0.14"
          className={styles.actions}
        >
          <Magnetic strength={0.22}>
            <Link href={copy.primaryCta.href} className="btn-primary">
              {copy.primaryCta.label}
              <span aria-hidden className="translate-y-px text-[0.95em]">
                →
              </span>
            </Link>
          </Magnetic>
          <Link href={copy.secondaryCta.href} className={styles.secondary}>
            {copy.secondaryCta.label}
          </Link>
        </div>
      </ScrollExpand>
    </section>
  );
}
