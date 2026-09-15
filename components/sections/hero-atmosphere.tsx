"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import { DotPattern } from "@/components/ui/dot-pattern";
import { useIsClient } from "@/hooks/use-is-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import styles from "./hero.module.css";

const LiquidEther = dynamic(() => import("@/components/effects/liquid-ether"), {
  ssr: false,
  loading: () => null,
});

/** Teal brand field — variants of #478997 / #3D7883 */
const ETHER_COLORS_DARK = ["#2f6b76", "#3D7883", "#6aadb8"];
const ETHER_COLORS_LIGHT = ["#478997", "#2f6b76", "#5a9aa5"];

function canUseHeroWebGL(): boolean {
  if (typeof window === "undefined") return false;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const compact = window.matchMedia("(max-width: 768px)").matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (coarse || compact || nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  return true;
}

/**
 * Decorative hero atmosphere only — Liquid Ether + mobile dots.
 * Must never gate or delay server-rendered LCP text in `Hero`.
 */
export function HeroAtmosphere() {
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const allowWebGL = isClient && !reduceMotion && canUseHeroWebGL();
  const isLight = isClient && resolvedTheme === "light";
  const showDotPattern = isClient && isMobile;

  return (
    <>
      <div aria-hidden data-hero-visual className={styles.ether}>
        {allowWebGL ? (
          <LiquidEther
            colors={isLight ? ETHER_COLORS_LIGHT : ETHER_COLORS_DARK}
            mouseForce={18}
            cursorSize={110}
            isViscous={false}
            viscous={30}
            iterationsViscous={12}
            iterationsPoisson={12}
            resolution={0.22}
            isBounce={false}
            autoDemo={false}
            autoSpeed={0.45}
            autoIntensity={2}
            takeoverDuration={0.25}
            autoResumeDelay={2800}
            autoRampDuration={0.6}
            BFECC={false}
            lightMode={isLight}
            backgroundColor={isLight ? "#f4f8f9" : "#04070a"}
            style={{ width: "100%", height: "100%", position: "absolute" }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--accent)_18%,transparent),transparent_55%)]" />
        )}
      </div>

      {showDotPattern ? (
        <div aria-hidden className={styles.dotPattern}>
          <DotPattern
            width={18}
            height={18}
            cr={1}
            className="text-foreground/[0.07] dark:text-foreground/[0.09]"
          />
        </div>
      ) : null}
    </>
  );
}
