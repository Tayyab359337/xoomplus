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
import { cn } from "@/lib/utils";

import styles from "./graphic-design-hero.module.css";

const FloatingLines = dynamic(
  () => import("@/components/effects/floating-lines"),
  {
    ssr: false,
    loading: () => null,
  },
);

type GraphicDesignHeroProps = {
  className?: string;
};

/** FloatingLines palette — vivid wave lines like the reference, teal-forward. */
const LINES_LIGHT = ["#7B5CFF", "#E947F5", "#478997", "#6AADB8"];
const LINES_DARK = ["#6AADB8", "#478997", "#E947F5", "#FEA106"];

function canUseLines(): boolean {
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
 * Graphic Design Solutions hero — FloatingLines full-bleed + centered badge/headline.
 * LCP heading stays visible HTML; GSAP only enhances.
 */
export function GraphicDesignHero({ className }: GraphicDesignHeroProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const isCompact = useMediaQuery("(max-width: 768px)");
  const sectionRef = useRef<HTMLElement>(null);
  const isLight = isClient && resolvedTheme === "light";
  const allowLines = isClient && !reduceMotion && canUseLines();

  useGSAP(
    () => {
      const hero = sectionRef.current;
      if (!hero || reduceMotion) return;

      registerGsapPlugins();

      const badge = hero.querySelector<HTMLElement>("[data-gd-badge]");
      const heading = hero.querySelector<HTMLElement>("[data-lcp]");
      const lines = hero.querySelector<HTMLElement>("[data-gd-lines]");

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

      if (lines) {
        tl.from(
          lines,
          {
            opacity: 0.35,
            scale: 1.02,
            duration: 0.85,
            clearProps: "transform,opacity",
          },
          0.08,
        );
      }

      // Desktop-only scrub — skip costly parallax on compact viewports
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

      scrollTl.to(hero, { scale: 0.985, ease: "none" }, 0);

      if (heading) {
        scrollTl.to(heading, { y: -24, ease: "none" }, 0);
      }

      if (lines) {
        scrollTl.to(lines, { y: 24, scale: 0.97, ease: "none" }, 0);
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
      <div data-gd-lines className={styles.linesLayer} aria-hidden>
        {allowLines ? (
          <FloatingLines
            linesGradient={isLight ? LINES_LIGHT : LINES_DARK}
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={isCompact ? [3, 4, 3] : [5, 7, 5]}
            lineDistance={isCompact ? [7, 6, 7] : [5, 4, 5]}
            topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
            middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
            bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
            animationSpeed={isCompact ? 0.4 : 0.75}
            interactive={!isCompact}
            parallax={!isCompact}
            parallaxStrength={0.18}
            bendRadius={5}
            bendStrength={-0.45}
            mixBlendMode="screen"
            backgroundColor={isLight ? "#f4f8f9" : "#04070a"}
            lightMode={isLight}
          />
        ) : (
          <div className={styles.linesFallback} />
        )}
      </div>

      <div aria-hidden className={styles.veil} />

      <div className={styles.shell}>
        <div className={styles.stack}>
          <div data-gd-badge className={styles.badge}>
            <span className={styles.badgeNew}>New</span>
            <span className={styles.badgeLabel}>Graphic Design</span>
          </div>

          <h1 data-lcp className={styles.headline}>
            Graphic Design Solutions
            <span className={styles.headlineBreak}>Crafted to cut through.</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
