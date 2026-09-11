"use client";

import { useRef } from "react";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  testimonials,
  testimonialsSectionCopy,
} from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

import styles from "./testimonials-section.module.css";

type TestimonialsSectionProps = {
  className?: string;
};

/**
 * Testimonials — dual infinite strips with alternating direction.
 * Both rows use the full list so the marquee never runs dry.
 */
export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

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
            {testimonialsSectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{testimonialsSectionCopy.title}</h2>
        </div>
        <p data-reveal className={styles.body}>
          {testimonialsSectionCopy.body}
        </p>
      </div>

      <div className={styles.rows}>
        <div data-reveal className={styles.row}>
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
            pauseOnHover
          />
        </div>
        <div data-reveal className={styles.row}>
          <InfiniteMovingCards
            items={[...testimonials].reverse()}
            direction="right"
            speed="slow"
            pauseOnHover
          />
        </div>
      </div>
    </section>
  );
}
