"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import Magnet from "@/components/ui/magnet";
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useIsClient } from "@/hooks/use-is-client";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { heroParallaxImages } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

const LiquidEther = dynamic(() => import("@/components/effects/liquid-ether"), {
  ssr: false,
  loading: () => null,
});

/** Teal brand field — variants of #478997 / #3D7883 */
const ETHER_COLORS_DARK = ["#2f6b76", "#3D7883", "#6aadb8"];
const ETHER_COLORS_LIGHT = ["#478997", "#2f6b76", "#5a9aa5"];

type HeroProps = {
  className?: string;
};

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
 * Homepage Hero — LiquidEther + Aceternity parallax images + LCP-safe typography.
 * SplashCursor stays global; no second cursor system here.
 * Primary heading is always visible HTML (never opacity:0 for LCP).
 */
export function Hero({ className }: HeroProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const allowWebGL = isClient && !reduceMotion && canUseHeroWebGL();
  const allowParallax = isClient && !reduceMotion;
  const isLight = isClient && resolvedTheme === "light";

  return (
    <section
      data-hero
      className={cn(
        "relative flex min-h-[100dvh] origin-center flex-col overflow-hidden border-b border-border bg-background",
        className,
      )}
    >
      {/* WebGL atmosphere — decorative, never blocks LCP text */}
      <div
        aria-hidden
        data-hero-visual
        className="pointer-events-none absolute inset-0 z-0 opacity-90"
      >
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

      {/* Aceternity mouse parallax — sits above ether, below copy */}
      {allowParallax ? (
        <div data-hero-visual className="contents">
          <ParallaxHeroImages
            images={[...heroParallaxImages]}
            variant="edge-focus"
            className="z-[1] opacity-[0.55] md:opacity-70"
            imageClassName="rounded-[var(--radius)] shadow-[0_12px_40px_color-mix(in_srgb,var(--foreground)_18%,transparent)] ring-border/40"
          />
        </div>
      ) : null}

      {/* Readability veil — keeps type clear over ether + images */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-background/25 via-background/45 to-background/90"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-4 pb-16 pt-28 text-center md:px-8 md:pb-28 md:pt-36 lg:px-12">
        <div className="flex w-full max-w-4xl flex-col items-center">
          <SectionEyebrow variant="bare" showArrow={false} data-hero-eyebrow>
            Creative studio
          </SectionEyebrow>

          {/* Real HTML heading for LCP — visible without JS animation */}
          <h1 data-lcp className="type-display mt-6 max-w-[18ch] text-foreground">
            Xoomplus{" "}
            <span className="text-accent">Digital Marketing</span>, Web &amp;
            Design Experts.
          </h1>

          <p
            data-hero-body
            className="type-body mx-auto mt-8 max-w-lg text-muted-foreground"
          >
            Ready to shine online? At XoomPlus, we create smart digital
            marketing, web development, and design solutions that get attention,
            engage visitors, and drive sales. From SEO and social media to
            branding and beautiful websites, we help your business grow quickly
            and effectively
          </p>

          <div
            data-hero-actions
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnet padding={60} magnetStrength={3}>
              <a href="#contact" className="btn-primary min-w-[10.5rem]">
                Start a project
                <span aria-hidden className="translate-y-px text-[0.95em]">
                  →
                </span>
              </a>
            </Magnet>
            <Magnet padding={50} magnetStrength={3.5}>
              <a href="#work" className="btn-ghost backdrop-blur-sm">
                View selected work
              </a>
            </Magnet>
          </div>
        </div>
      </div>
    </section>
  );
}
