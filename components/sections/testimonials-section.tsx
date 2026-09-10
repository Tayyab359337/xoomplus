"use client";

import { Reveal } from "@/components/motion/reveal";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
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
  return (
    <section
      id="clients"
      aria-label="Client testimonials"
      className={cn(styles.section, className)}
    >
      <div className={styles.header}>
        <Reveal variant="fadeUp">
          <p className={styles.eyebrow}>{testimonialsSectionCopy.eyebrow}</p>
          <h2 className={styles.title}>{testimonialsSectionCopy.title}</h2>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.06}>
          <p className={styles.body}>{testimonialsSectionCopy.body}</p>
        </Reveal>
      </div>

      <div className={styles.rows}>
        <Reveal variant="fadeUp" delay={0.08} className={styles.row}>
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
            pauseOnHover
          />
        </Reveal>
        <Reveal variant="fadeUp" delay={0.12} className={styles.row}>
          <InfiniteMovingCards
            items={[...testimonials].reverse()}
            direction="right"
            speed="slow"
            pauseOnHover
          />
        </Reveal>
      </div>
    </section>
  );
}
