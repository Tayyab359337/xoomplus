"use client";

import Link from "next/link";
import { useRef } from "react";

import Magnet from "@/components/ui/magnet";
import { DottedMap } from "@/components/ui/dotted-map";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { locations, locationsPageCopy } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

import styles from "./locations-cta.module.css";

type LocationsCtaProps = {
  className?: string;
};

/**
 * Locations CTA — Magic UI Dotted Map as a quiet backdrop behind the copy.
 */
export function LocationsCta({ className }: LocationsCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copy = locationsPageCopy.cta;
  useSectionReveal(sectionRef);

  const markers = locations.map((location) => ({
    lat: location.lat,
    lng: location.lng,
    size: 0.55,
  }));

  return (
    <section
      ref={sectionRef}
      aria-label="Get started"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.map} aria-hidden>
        <DottedMap
          markers={markers}
          mapSamples={2800}
          dotRadius={0.16}
          stagger
          pulse={false}
          className={styles.dotted}
          markerColor="#478997"
        />
      </div>
      <div className={styles.veil} aria-hidden />

      <div className={styles.shell}>
        <div data-reveal className={styles.content}>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.body}>{copy.body}</p>
          <Magnet padding={48} magnetStrength={3}>
            <Link href={copy.href} className="btn-primary">
              {copy.label}
              <span aria-hidden className="translate-y-px text-[0.95em]">
                →
              </span>
            </Link>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
