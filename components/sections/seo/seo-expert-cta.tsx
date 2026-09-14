"use client";

import Link from "next/link";
import { useRef, type RefObject } from "react";
import { useTheme } from "next-themes";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { useIsClient } from "@/hooks/use-is-client";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { seoExpertCtaCopy } from "@/lib/data/seo-expert-cta";
import { cn } from "@/lib/utils";

import styles from "./seo-expert-cta.module.css";

type BeamLine = {
  left: number;
  right: number;
  curvature: number;
  reverse?: boolean;
  delay?: number;
  duration?: number;
};

/** Full-width arc lines — Magic UI beam light only (no nodes/icons). */
const BEAM_LINES: BeamLine[] = [
  { left: 18, right: 18, curvature: 140, delay: 0, duration: 6.5 },
  { left: 32, right: 32, curvature: 95, reverse: true, delay: 0.35, duration: 5.8 },
  { left: 46, right: 46, curvature: 48, delay: 0.7, duration: 7 },
  { left: 60, right: 60, curvature: -48, reverse: true, delay: 0.2, duration: 6.2 },
  { left: 74, right: 74, curvature: -95, delay: 0.55, duration: 5.5 },
  { left: 86, right: 86, curvature: -140, reverse: true, delay: 0.9, duration: 6.8 },
];

const COLORS_LIGHT = {
  path: "#b7c9ce",
  start: "#478997",
  stop: "#FEA106",
};

const COLORS_DARK = {
  path: "#2a383e",
  start: "#FEA106",
  stop: "#6AADB8",
};

type ArcBeamProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  line: BeamLine;
  pathColor: string;
  startColor: string;
  stopColor: string;
  pathOpacity: number;
};

function ArcBeam({
  containerRef,
  line,
  pathColor,
  startColor,
  stopColor,
  pathOpacity,
}: ArcBeamProps) {
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);

  return (
    <>
      <span
        ref={fromRef}
        aria-hidden
        className={styles.anchor}
        style={{ left: "1.5%", top: `${line.left}%` }}
      />
      <span
        ref={toRef}
        aria-hidden
        className={styles.anchor}
        style={{ right: "1.5%", top: `${line.right}%` }}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
        curvature={line.curvature}
        reverse={line.reverse}
        delay={line.delay}
        duration={line.duration}
        pathWidth={1.35}
        pathOpacity={pathOpacity}
        pathColor={pathColor}
        gradientStartColor={startColor}
        gradientStopColor={stopColor}
      />
    </>
  );
}

type SeoExpertCtaProps = {
  className?: string;
};

/**
 * Expert CTA under SEO hero — theme-aware; beam effect on arc lines only.
 */
export function SeoExpertCta({ className }: SeoExpertCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const isClient = useIsClient();
  const { resolvedTheme } = useTheme();
  const isDark = isClient && resolvedTheme === "dark";
  const colors = isDark ? COLORS_DARK : COLORS_LIGHT;

  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-section-reveal
      aria-labelledby="seo-expert-cta-heading"
      className={cn(styles.section, className)}
    >
      <div ref={containerRef} className={styles.stage}>
        <div aria-hidden className={styles.glow} />

        {!reduceMotion
          ? BEAM_LINES.map((line, index) => (
              <ArcBeam
                key={`arc-${index}`}
                containerRef={containerRef}
                line={line}
                pathColor={colors.path}
                startColor={colors.start}
                stopColor={colors.stop}
                pathOpacity={isDark ? 0.45 : 0.5}
              />
            ))
          : null}

        <div data-reveal-heading className={styles.content}>
          <h2 id="seo-expert-cta-heading" className={styles.title}>
            {seoExpertCtaCopy.title}
          </h2>
          <Link
            href={seoExpertCtaCopy.cta.href}
            className={cn("btn-primary", styles.cta)}
          >
            {seoExpertCtaCopy.cta.label}
            <span aria-hidden className={styles.ctaChevron}>
              ›
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
