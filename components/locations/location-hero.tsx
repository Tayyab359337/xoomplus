"use client";

import type { COBEOptions } from "cobe";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";

import { Globe } from "@/components/ui/globe";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useIsClient } from "@/hooks/use-is-client";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import type { Location } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

import styles from "./location-hero.module.css";

type LocationHeroProps = {
  location: Location;
  className?: string;
};

/** Teal brand — #478997 light / #4a8f9b dark */
const MARKER_LIGHT: [number, number, number] = [71 / 255, 137 / 255, 151 / 255];
const MARKER_DARK: [number, number, number] = [74 / 255, 143 / 255, 155 / 255];

/**
 * Face a lat/lng on the Cobe globe (phi = Y rotation, theta = X rotation).
 */
function locationToAngles(lat: number, lng: number) {
  return {
    phi: Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
    theta: Math.min(0.42, Math.max(0.16, (lat * Math.PI) / 180 * 0.5)),
  };
}

/**
 * Single-location hero — Magic UI Globe focused on this studio.
 */
export function LocationHero({ location, className }: LocationHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isClient = useIsClient();
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = isClient && resolvedTheme === "dark";
  useSectionReveal(sectionRef);

  const config = useMemo<COBEOptions>(() => {
    const { phi, theta } = locationToAngles(location.lat, location.lng);
    return {
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi,
      theta,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 0.6 : 0.55,
      mapSamples: 16000,
      mapBrightness: isDark ? 6 : 1.35,
      // Light mode: neutral gray globe; dark keeps teal brand tint
      baseColor: isDark ? [0.24, 0.47, 0.51] : [0.62, 0.64, 0.66],
      markerColor: isDark ? MARKER_DARK : MARKER_LIGHT,
      glowColor: isDark ? [0.08, 0.14, 0.16] : [0.94, 0.95, 0.96],
      markers: [{ location: [location.lat, location.lng], size: 0.1 }],
    };
  }, [isDark, location.lat, location.lng]);

  return (
    <section
      ref={sectionRef}
      aria-label={location.name}
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <header data-reveal className={styles.copy}>
          <SectionEyebrow className={styles.eyebrow}>Location</SectionEyebrow>
          <h1 className={styles.title}>{location.name}</h1>
          <p className={styles.body}>{location.descriptor}</p>
        </header>

        <div data-reveal className={styles.globeStage}>
          {isClient ? (
            <Globe
              className={styles.globe}
              config={config}
              autoRotate={!reduceMotion}
            />
          ) : null}
          <div aria-hidden className={styles.globeFade} />
        </div>
      </div>
    </section>
  );
}
