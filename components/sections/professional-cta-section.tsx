"use client";

import Link from "next/link";

import { ScrollExpand } from "@/components/scroll-expand";
import { useMediaQuery } from "@/hooks/use-media-query";
import { professionalCtaCopy } from "@/lib/data/cta";
import { cn } from "@/lib/utils";

import styles from "./professional-cta-section.module.css";

type ProfessionalCtaSectionProps = {
  className?: string;
};

/**
 * Professional CTA — ScrollExpand frame that opens to full-bleed on page scroll.
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
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.overlayTitle}>{copy.title}</h2>
        <p className={styles.body}>{copy.body}</p>
        <div className={styles.actions}>
          <Link href={copy.primaryCta.href} className={styles.primary}>
            {copy.primaryCta.label}
          </Link>
          <Link href={copy.secondaryCta.href} className={styles.secondary}>
            {copy.secondaryCta.label}
          </Link>
        </div>
      </ScrollExpand>
    </section>
  );
}
