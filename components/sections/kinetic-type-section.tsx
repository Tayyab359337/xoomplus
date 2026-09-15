"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  featureEnabled,
  gsap,
  registerGsapPlugins,
  resolveMotionTier,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

import styles from "./kinetic-type-section.module.css";

const WORDS = [
  { text: "GROWTH", x: -10 },
  { text: "CREATIVE", x: 6 },
  { text: "DIGITAL", x: -7 },
] as const;

/**
 * Editorial kinetic typography — subtle opposing xPercent scrub.
 * One decorative moment only; disabled on mobile / reduced motion.
 */
export function KineticTypeSection({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const tier = resolveMotionTier({
        reducedMotion: reduceMotion,
        width: window.innerWidth,
      });
      if (!featureEnabled("kineticType", tier)) return;

      registerGsapPlugins();
      const lines = root.querySelectorAll<HTMLElement>("[data-kinetic-line]");

      lines.forEach((line) => {
        const amount = Number(line.dataset.kineticX ?? 0);
        gsap.fromTo(
          line,
          { xPercent: amount },
          {
            xPercent: -amount,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { dependencies: [reduceMotion], scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-hidden
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.stack}>
        {WORDS.map((word) => (
          <p
            key={word.text}
            data-kinetic-line
            data-kinetic-x={word.x}
            className={styles.word}
          >
            {word.text}
          </p>
        ))}
      </div>
    </section>
  );
}
