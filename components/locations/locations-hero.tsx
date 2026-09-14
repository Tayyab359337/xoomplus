"use client";

import { useRef } from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import WorldMap from "@/components/ui/world-map";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { locations, locationsPageCopy } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

import styles from "./locations-hero.module.css";

type LocationsHeroProps = {
  className?: string;
};

/**
 * Locations hero — World Map is the primary visual, copy stays short.
 */
export function LocationsHero({ className }: LocationsHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copy = locationsPageCopy.hero;
  useSectionReveal(sectionRef);

  const points = locations.map((location) => ({
    lat: location.lat,
    lng: location.lng,
    label: location.name,
  }));

  const dots = locations.slice(0, -1).flatMap((location, index) => {
    const next = locations[index + 1];
    if (!next) return [];
    return [
      {
        start: { lat: location.lat, lng: location.lng },
        end: { lat: next.lat, lng: next.lng },
      },
    ];
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Locations"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <header data-reveal className={styles.copy}>
          <SectionEyebrow className={styles.eyebrow}>{copy.eyebrow}</SectionEyebrow>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.body}>{copy.body}</p>
        </header>

        <div data-reveal className={styles.mapWrap}>
          <WorldMap points={points} dots={dots} />
        </div>
      </div>
    </section>
  );
}
