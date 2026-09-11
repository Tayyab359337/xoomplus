"use client";

import {
  serviceCategories,
  servicesSectionCopy,
} from "@/lib/data/services";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
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
      <div data-animate="fade-up" className={styles.header}>
        <div>
          <SectionEyebrow className={styles.eyebrow}>
            {servicesSectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{servicesSectionCopy.title}</h2>
        </div>
        <p className={styles.body}>{servicesSectionCopy.body}</p>
      </div>

      <div data-animate="fade-up" data-animate-delay="0.08">
        <ServicesInfiniteCarousel
          services={serviceCategories}
          interaction={mode}
        />
      </div>
    </section>
  );
}
