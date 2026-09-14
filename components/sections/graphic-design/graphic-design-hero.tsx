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
import type { GraphicDesignHeroContent } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

import styles from "./graphic-design-hero.module.css";

const SoftAurora = dynamic(
  () => import("@/components/effects/soft-aurora"),
  {
    ssr: false,
    loading: () => null,
  },
);

type GraphicDesignHeroProps = {
  className?: string;
  copy: GraphicDesignHeroContent;
};

/** SoftAurora palette — light uses primary teal only; dark keeps secondary chroma. */
const AURORA_LIGHT = { color1: "#478997", color2: "#478997" };
const AURORA_DARK = { color1: "#6AADB8", color2: "#E947F5" };

function canUseAurora(): boolean {
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
 * Graphic Design Solutions hero — SoftAurora + WordPress page 2417 copy.
 */
export function GraphicDesignHero({ className, copy }: GraphicDesignHeroProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const isCompact = useMediaQuery("(max-width: 768px)");
  const sectionRef = useRef<HTMLElement>(null);
  const isLight = isClient && resolvedTheme === "light";
  const allowAurora = isClient && !reduceMotion && canUseAurora();
  const colors = isLight ? AURORA_LIGHT : AURORA_DARK;

  useGSAP(
    () => {
      const hero = sectionRef.current;
      if (!hero || reduceMotion) return;

      registerGsapPlugins();

      const badge = hero.querySelector<HTMLElement>("[data-gd-badge]");
      const heading = hero.querySelector<HTMLElement>("[data-lcp]");
      const body = hero.querySelector<HTMLElement>("[data-gd-body]");
      const aurora = hero.querySelector<HTMLElement>("[data-gd-aurora]");
      const stack = hero.querySelector<HTMLElement>("[data-gd-stack]");

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

      if (aurora) {
        tl.from(
          aurora,
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
          scrub: 0.55,
        },
      });

      // Never transform the section itself — that kills backdrop-filter in Chromium
      if (aurora) {
        scrollTl.to(aurora, { y: 28, scale: 0.97, ease: "none" }, 0);
      }

      if (heading) {
        scrollTl.to(heading, { y: -24, ease: "none" }, 0);
      }

      if (stack) {
        scrollTl.to(stack, { y: -10, ease: "none" }, 0);
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
      data-gd-hero
      aria-label="Graphic Design Solutions"
      className={cn(styles.section, className)}
    >
      <div data-gd-aurora className={styles.auroraLayer} aria-hidden>
        {allowAurora ? (
          <SoftAurora
            color1={colors.color1}
            color2={colors.color2}
            lightMode={isLight}
            speed={isCompact ? 0.4 : 0.65}
            brightness={isLight ? 0.38 : 1.15}
            scale={isCompact ? 1.35 : 1.55}
            bandHeight={0.48}
            bandSpread={1.05}
            enableMouseInteraction={!isCompact}
            mouseInfluence={0.22}
          />
        ) : (
          <div className={styles.auroraFallback} />
        )}
      </div>

      <div aria-hidden className={styles.veil} />

      <div className={styles.shell}>
        <div data-gd-stack className={styles.stack}>
          <div aria-hidden className={styles.frost} />
          <div data-gd-badge className={styles.badge}>
            <span className={styles.badgeChip}>Home</span>
            <span className={styles.badgeLabel}>{copy.eyebrow}</span>
          </div>

          <h1 data-lcp className={styles.headline}>
            {copy.headline}
          </h1>

          <p data-gd-body className={styles.body}>
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  );
}
