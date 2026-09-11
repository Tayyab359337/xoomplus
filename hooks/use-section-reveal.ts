"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

import { useAnimation } from "@/components/animations/AnimationProvider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  DUR,
  EASE,
  gsap,
  isCompactViewport,
  registerGsapPlugins,
  REVEAL_Y,
  SCROLL_START,
  STAGGER,
} from "@/lib/animations/gsap";

export const REVEAL_SELECTOR = "[data-reveal]";
export const REVEAL_STAGGER_SELECTOR = "[data-reveal-stagger]";

type UseSectionRevealOptions = {
  /** Override ScrollTrigger start. Default "top 80%" */
  start?: string;
  /** Extra deps that should re-run the reveal setup */
  dependencies?: unknown[];
};

/**
 * One ScrollTrigger-driven fade+y reveal per section (scoped via useGSAP).
 * Targets `[data-reveal]` as a group, and children of `[data-reveal-stagger]`
 * with a consistent stagger. Skips entirely under prefers-reduced-motion.
 */
export function useSectionReveal(
  sectionRef: RefObject<HTMLElement | null>,
  options: UseSectionRevealOptions = {},
) {
  const reduceMotion = usePrefersReducedMotion();
  const { preloaderDone } = useAnimation();
  const { start = SCROLL_START, dependencies = [] } = options;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reduceMotion || !preloaderDone) return;

      registerGsapPlugins();

      const y = isCompactViewport() ? Math.round(REVEAL_Y * 0.45) : REVEAL_Y;
      const staggerAmt = isCompactViewport() ? STAGGER * 0.5 : STAGGER;

      const singles = Array.from(
        section.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
      ).filter((el) => !el.closest(REVEAL_STAGGER_SELECTOR));

      const staggerRoots = Array.from(
        section.querySelectorAll<HTMLElement>(REVEAL_STAGGER_SELECTOR),
      );

      const targets: HTMLElement[] = [...singles];
      for (const root of staggerRoots) {
        const kids = Array.from(
          root.querySelectorAll<HTMLElement>(
            root.dataset.revealChildren || ":scope > *",
          ),
        );
        if (kids.length) targets.push(...kids);
        else targets.push(root);
      }

      if (!targets.length) return;

      gsap.set(targets, { opacity: 0, y });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: DUR,
        ease: EASE,
        stagger: targets.length > 1 ? staggerAmt : 0,
        clearProps: "transform",
        scrollTrigger: {
          trigger: section,
          start,
          toggleActions: "play none none none",
        },
      });
    },
    {
      scope: sectionRef,
      dependencies: [reduceMotion, preloaderDone, start, ...dependencies],
    },
  );
}
