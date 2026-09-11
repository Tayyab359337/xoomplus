"use client";

import { useRef } from "react";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  testimonials,
  testimonialsSectionCopy,
  type Testimonial,
} from "@/lib/data/testimonials";
import type { SectionCopy } from "@/lib/wordpress/types";
import { cn } from "@/lib/utils";

import styles from "./testimonials-section.module.css";

type TestimonialsSectionProps = {
  className?: string;
  items?: Testimonial[];
  copy?: SectionCopy;
};

/**
 * Testimonials — dual infinite strips with alternating direction.
 * Both rows use the full list so the marquee never runs dry.
 */
export function TestimonialsSection({
  className,
  items,
  copy,
}: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const list = items ?? testimonials;
  const sectionCopy = copy ?? testimonialsSectionCopy;

  return (
    <section
      ref={sectionRef}
      id="clients"
      aria-label="Client testimonials"
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

      <div className={styles.rows}>
        <div data-reveal className={styles.row}>
          <InfiniteMovingCards
            items={list}
            direction="left"
            speed="slow"
            pauseOnHover
          />
        </div>
        <div data-reveal className={styles.row}>
          <InfiniteMovingCards
            items={[...list].reverse()}
            direction="right"
            speed="slow"
            pauseOnHover
          />
        </div>
      </div>
    </section>
  );
}
