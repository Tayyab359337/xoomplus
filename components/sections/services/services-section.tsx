"use client";

import { Reveal } from "@/components/motion/reveal";
import {
  serviceCategories,
  servicesSectionCopy,
} from "@/lib/data/services";
import { cn } from "@/lib/utils";

import { ServicesInfiniteCarousel } from "./services-infinite-carousel";
import styles from "./services-section.module.css";
import { useServicesInteractionMode } from "./use-services-interaction-mode";

type ServicesSectionProps = {
  className?: string;
};

/**
 * Services — infinite carousel on all breakpoints.
 * Desktop: hover expand + autoplay. Tablet: tap expand + autoplay.
 * Mobile: one card at a time, no autoplay, tap to read full content.
 */
export function ServicesSection({ className }: ServicesSectionProps) {
  const mode = useServicesInteractionMode();

  return (
    <section
      id="approach"
      aria-label="Services"
      className={cn(styles.section, className)}
    >
      <div className={styles.header}>
        <Reveal variant="fadeUp">
          <p className={styles.eyebrow}>{servicesSectionCopy.eyebrow}</p>
          <h2 className={styles.title}>{servicesSectionCopy.title}</h2>
        </Reveal>
        <Reveal variant="fadeUp" delay={0.06}>
          <p className={styles.body}>{servicesSectionCopy.body}</p>
        </Reveal>
      </div>

      <ServicesInfiniteCarousel
        services={serviceCategories}
        interaction={mode}
      />
    </section>
  );
}
