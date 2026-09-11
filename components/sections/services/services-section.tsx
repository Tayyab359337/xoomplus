"use client";

import { useRef } from "react";

import {
  serviceCategories,
  servicesSectionCopy,
  type ServiceCategory,
} from "@/lib/data/services";
import type { SectionCopy } from "@/lib/wordpress/types";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { cn } from "@/lib/utils";

import { ServicesInfiniteCarousel } from "./services-infinite-carousel";
import styles from "./services-section.module.css";
import { useServicesInteractionMode } from "./use-services-interaction-mode";

type ServicesSectionProps = {
  className?: string;
  services?: ServiceCategory[];
  copy?: SectionCopy;
};

/**
 * Services — infinite carousel on all breakpoints.
 * Desktop: hover expand + autoplay. Tablet: tap expand + autoplay.
 * Mobile: one card at a time, no autoplay, tap to read full content.
 */
export function ServicesSection({
  className,
  services,
  copy,
}: ServicesSectionProps) {
  const mode = useServicesInteractionMode();
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const items = services ?? serviceCategories;
  const sectionCopy = copy ?? servicesSectionCopy;

  return (
    <section
      ref={sectionRef}
      id="approach"
      aria-label="Services"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div data-reveal className={styles.header}>
        <div>
          <SectionEyebrow className={styles.eyebrow}>
            {sectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{sectionCopy.title}</h2>
        </div>
        {sectionCopy.body ? (
          <p className={styles.body}>{sectionCopy.body}</p>
        ) : null}
      </div>

      <div data-reveal>
        <ServicesInfiniteCarousel
          services={items}
          interaction={mode}
        />
      </div>
    </section>
  );
}
