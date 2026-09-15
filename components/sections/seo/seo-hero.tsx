"use client";

import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useRef } from "react";

import { useIsClient } from "@/hooks/use-is-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  EASE_OUT_EXPO,
  gsap,
  registerGsapPlugins,
  ScrollTrigger,
} from "@/lib/animations";
import type { SeoServicesHeroCopy } from "@/lib/data/seo-services-hero";
import { cn } from "@/lib/utils";

import styles from "./seo-hero.module.css";

const WebThreads = dynamic(() => import("@/components/effects/web-threads"), {
  ssr: false,
  loading: () => null,
});

type SeoHeroProps = {
  className?: string;
  copy: SeoServicesHeroCopy;
};

/** WebThreads palette — gold/teal like the reference (dark), softer teal (light). */
const THREADS_LIGHT = {
  color1: "#478997",
  color2: "#6AADB8",
  color3: "#FEA106",
  backgroundColor: "#f4f8f9",
};

const THREADS_DARK = {
  color1: "#FEA106",
  color2: "#E8C078",
  color3: "#FFFFFF",
  backgroundColor: "#04070a",
};

function canUseThreads(): boolean {
  if (typeof window === "undefined") return false;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const compact = window.matchMedia("(max-width: 768px)").matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (
    coarse &&
    compact &&
    typeof nav.deviceMemory === "number" &&
    nav.deviceMemory < 6
  ) {
    return false;
  }
  return true;
}

/**
 * SEO Services hero — shared service-page hero layout + WebThreads BG.
 * Frost card uses backdrop-filter; never transform .stack / .frost / .shell.
 */
export function SeoHero({ className, copy }: SeoHeroProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const isCompact = useMediaQuery("(max-width: 768px)");
  const sectionRef = useRef<HTMLElement>(null);
  const isLight = isClient && resolvedTheme === "light";
  const allowThreads = isClient && !reduceMotion && canUseThreads();
  const palette = isLight ? THREADS_LIGHT : THREADS_DARK;

  useGSAP(
    () => {
      const hero = sectionRef.current;
      if (!hero || reduceMotion) return;

      registerGsapPlugins();

      const badge = hero.querySelector<HTMLElement>("[data-seo-badge]");
      const heading = hero.querySelector<HTMLElement>("[data-lcp]");
      const body = hero.querySelector<HTMLElement>("[data-seo-body]");
      const threads = hero.querySelector<HTMLElement>("[data-seo-threads]");

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT_EXPO } });

      if (badge) {
        tl.from(badge, { y: 12, duration: 0.5, clearProps: "transform" }, 0);
      }

      if (heading) {
        tl.from(
          heading,
          { y: 10, duration: 0.65, clearProps: "transform" },
          0.05,
        );
      }

      if (body) {
        tl.from(
          body,
          { y: 8, opacity: 0.4, duration: 0.55, clearProps: "transform,opacity" },
          0.12,
        );
      }

      if (threads) {
        tl.from(
          threads,
          {
            opacity: 0.35,
            scale: 1.02,
            duration: 0.85,
            clearProps: "transform,opacity",
          },
          0.08,
        );
      }

      if (isCompact) {
        return () => {
          tl.kill();
        };
      }

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Parallax BG + copy only — never the frost stack (breaks backdrop-filter)
      if (threads) {
        scrollTl.to(threads, { y: 28, scale: 0.97, ease: "none" }, 0);
      }

      if (heading) {
        scrollTl.to(heading, { y: -24, ease: "none" }, 0);
      }

      if (body) {
        scrollTl.to(body, { y: -12, ease: "none" }, 0);
      }

      return () => {
        scrollTl.scrollTrigger?.kill();
        scrollTl.kill();
        tl.kill();
        ScrollTrigger.getAll()
          .filter((st) => st.trigger === hero)
          .forEach((st) => st.kill());
      };
    },
    { dependencies: [reduceMotion, isCompact], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-seo-hero
      aria-label="SEO Services"
      className={cn(styles.section, className)}
    >
      <div data-seo-threads className={styles.threadsLayer} aria-hidden>
        {allowThreads ? (
          <WebThreads
            color1={palette.color1}
            color2={palette.color2}
            color3={palette.color3}
            backgroundColor={palette.backgroundColor}
            lightMode={isLight}
            speed={isCompact ? 0.12 : 0.2}
            threadCount={isCompact ? 5 : 7}
            frequency={isCompact ? 4.2 : 5.2}
            spread={0.2}
            taper={1.05}
            position={0.52}
            fanMode="center"
            glow={0.025}
            falloff={0.55}
            thickness={1.15}
            brightness={isLight ? 0.55 : 0.75}
            opacity={1}
            mirror
            shimmer={false}
            grain
            grainIntensity={0.04}
            mouseInteraction={!isCompact}
            mouseStrength={0.28}
            className="h-full w-full"
          />
        ) : (
          <div className={styles.threadsFallback} />
        )}
      </div>

      <div aria-hidden className={styles.veil} />

      <div className={styles.shell}>
        <div data-seo-stack className={styles.stack}>
          <div aria-hidden className={styles.frost} />
          <div data-seo-badge className={styles.badge}>
            <span className={styles.badgeChip}>{copy.chip}</span>
            <span className={styles.badgeLabel}>{copy.eyebrow}</span>
          </div>

          <h1 data-lcp className={styles.headline}>
            {copy.headline}
          </h1>

          <p data-seo-body className={styles.body}>
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  );
}
