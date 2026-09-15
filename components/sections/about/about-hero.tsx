"use client";

import { useGSAP } from "@gsap/react";
import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useRef } from "react";

import { AppLink } from "@/components/ui/app-link";
import { useIsClient } from "@/hooks/use-is-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  EASE_OUT_EXPO,
  gsap,
  registerGsapPlugins,
  ScrollTrigger,
} from "@/lib/animations";
import { aboutHeroCopy } from "@/lib/data/about";
import { cn } from "@/lib/utils";

import styles from "./about-hero.module.css";

const DotGrid = dynamic(() => import("@/components/DotGrid"), {
  ssr: false,
  loading: () => null,
});

type AboutHeroProps = {
  className?: string;
};

const GRID_LIGHT = { baseColor: "#c8d8dc", activeColor: "#478997" };
const GRID_DARK = { baseColor: "#1c3339", activeColor: "#4a8f9b" };

function canUseDotGrid(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  return true;
}

/**
 * About hero — editorial H1 + accessible breadcrumb over a subtle DotGrid.
 */
export function AboutHero({ className }: AboutHeroProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const isCompact = useMediaQuery("(max-width: 768px)");
  const sectionRef = useRef<HTMLElement>(null);
  const isLight = isClient && resolvedTheme === "light";
  const allowGrid = isClient && !reduceMotion && canUseDotGrid();
  const palette = isLight ? GRID_LIGHT : GRID_DARK;

  useGSAP(
    () => {
      const hero = sectionRef.current;
      if (!hero || reduceMotion) return;

      registerGsapPlugins();

      const crumb = hero.querySelector<HTMLElement>("[data-about-crumb]");
      const heading = hero.querySelector<HTMLElement>("[data-lcp]");
      const grid = hero.querySelector<HTMLElement>("[data-about-grid]");

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT_EXPO } });

      if (crumb) {
        tl.from(crumb, { y: 12, duration: 0.5, clearProps: "transform" }, 0);
      }

      if (heading) {
        tl.from(
          heading,
          { y: 10, duration: 0.65, clearProps: "transform" },
          0.05,
        );
      }

      if (grid) {
        tl.from(
          grid,
          {
            opacity: 0.4,
            duration: 0.85,
            clearProps: "opacity",
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

      if (grid) {
        scrollTl.to(grid, { y: 24, ease: "none" }, 0);
      }
      if (heading) {
        scrollTl.to(heading, { y: -20, ease: "none" }, 0);
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
      aria-label="About Xoomplus"
      className={cn(styles.section, className)}
    >
      <div data-about-grid className={styles.gridLayer} aria-hidden>
        {allowGrid ? (
          <DotGrid
            dotSize={isCompact ? 2.5 : 3}
            gap={isCompact ? 26 : 32}
            baseColor={palette.baseColor}
            activeColor={palette.activeColor}
            proximity={isCompact ? 80 : 140}
            speedTrigger={140}
            shockRadius={isCompact ? 80 : 160}
            shockStrength={2}
            className={styles.grid}
          />
        ) : (
          <div className={styles.gridFallback} />
        )}
      </div>

      <div aria-hidden className={styles.veil} />

      <div className={styles.shell}>
        <div className={styles.stack}>
          <div aria-hidden className={styles.frost} />

          <nav
            data-about-crumb
            aria-label="Breadcrumb"
            className={styles.breadcrumb}
          >
            <ol className={styles.crumbList}>
              <li className={styles.crumbItem}>
                <AppLink href={aboutHeroCopy.homeHref} className={styles.crumbHome}>
                  {aboutHeroCopy.homeLabel}
                </AppLink>
              </li>
              <li className={styles.crumbItem} aria-current="page">
                <ChevronRight className={styles.crumbSep} aria-hidden />
                <span className={cn(styles.crumbCurrent, "type-body")}>
                  {aboutHeroCopy.currentLabel}
                </span>
              </li>
            </ol>
          </nav>

          <h1 data-lcp className={cn(styles.headline, "type-body")}>
            {aboutHeroCopy.heading}
          </h1>
        </div>
      </div>
    </section>
  );
}
