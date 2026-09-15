"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  featureEnabled,
  gsap,
  registerGsapPlugins,
  resolveMotionTier,
  revealTextLines,
  splitText,
} from "@/lib/animations";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/utils";

import styles from "./statement-section.module.css";

const STATEMENT =
  "WE BUILD DIGITAL EXPERIENCES THAT GROW WITH AMBITION";

/**
 * One premium scrub-linked statement — muted → bright word by word.
 * Desktop/tablet only; static on mobile / reduced motion.
 */
export function StatementSection({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const line = lineRef.current;
      if (!root || !line) return;

      const tier = resolveMotionTier({
        reducedMotion: reduceMotion,
        width: window.innerWidth,
      });
      if (!featureEnabled("scrubTypography", tier)) return;

      registerGsapPlugins();
      const { wraps, restore } = splitText(line, "words");
      gsap.set(wraps, { opacity: 0.18 });

      const tween = gsap.to(wraps, {
        opacity: 1,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          end: "center 35%",
          scrub: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        restore();
      };
    },
    { dependencies: [reduceMotion], scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-label="Studio statement"
      className={cn(styles.section, className)}
    >
      <SectionEyebrow data-motion="fade-up" className={styles.eyebrow}>
        Manifesto
      </SectionEyebrow>
      <p ref={lineRef} className={styles.statement}>
        {STATEMENT}
      </p>
    </section>
  );
}

type HeadingRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "p";
};

/**
 * Clip + translate heading reveal for section titles.
 */
export function HeadingReveal({
  children,
  className,
  as: Tag = "h2",
}: HeadingRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduceMotion) return;
      registerGsapPlugins();
      const { wraps, restore } = splitText(el, "lines");
      const tween = revealTextLines(wraps, {
        y: 105,
        duration: 0.95,
        stagger: 0.1,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        restore();
      };
    },
    { dependencies: [reduceMotion] },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
