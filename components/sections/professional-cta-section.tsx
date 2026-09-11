"use client";

import Link from "next/link";
import { useRef } from "react";

import { HoverLift } from "@/components/animations/HoverLift";
import { ScrollExpand } from "@/components/scroll-expand";
import Magnet from "@/components/ui/magnet";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { professionalCtaCopy } from "@/lib/data/cta";
import type { HomepageCta } from "@/lib/wordpress/types";
import { cn } from "@/lib/utils";

import styles from "./professional-cta-section.module.css";

type ProfessionalCtaSectionProps = {
  className?: string;
  content?: HomepageCta;
};

/**
 * Professional CTA — ScrollExpand crescendo + restrained GSAP entrance.
 */
export function ProfessionalCtaSection({
  className,
  content,
}: ProfessionalCtaSectionProps) {
  const copy = content ?? professionalCtaCopy;
  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="start"
      aria-label="Start a project"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div data-reveal className={styles.expandWrap}>
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
          <SectionEyebrow className={styles.eyebrow}>
            {copy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.overlayTitle}>{copy.title}</h2>
          <p className={styles.body}>{copy.body}</p>
          <div className={styles.actions}>
            <Magnet padding={60} magnetStrength={3}>
              {copy.primaryCta.href.startsWith("tel:") ||
              copy.primaryCta.href.startsWith("mailto:") ? (
                <a href={copy.primaryCta.href} className="btn-primary">
                  {copy.primaryCta.label}
                  <span aria-hidden className="translate-y-px text-[0.95em]">
                    →
                  </span>
                </a>
              ) : (
                <Link href={copy.primaryCta.href} className="btn-primary">
                  {copy.primaryCta.label}
                  <span aria-hidden className="translate-y-px text-[0.95em]">
                    →
                  </span>
                </Link>
              )}
            </Magnet>
            <HoverLift y={-2} scale={1.01} className="inline-flex">
              <Link href={copy.secondaryCta.href} className={styles.secondary}>
                {copy.secondaryCta.label}
              </Link>
            </HoverLift>
          </div>
        </ScrollExpand>
      </div>
    </section>
  );
}
