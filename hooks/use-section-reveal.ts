"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

import { useAnimation } from "@/components/animations/AnimationProvider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  DUR,
  EASE,
  EASE_SOFT,
  gsap,
  isCompactViewport,
  registerGsapPlugins,
  REVEAL_Y,
  SCROLL_START,
  STAGGER,
} from "@/lib/animations/gsap";

export const REVEAL_SELECTOR = "[data-reveal]";
export const REVEAL_STAGGER_SELECTOR = "[data-reveal-stagger]";

/** Slow left-slide for primary headings only — leaves other reveals alone */
const HEADING_DUR = 1.35;
const HEADING_X_DESKTOP = 56;
const HEADING_X_MOBILE = 28;

type UseSectionRevealOptions = {
  /** Override ScrollTrigger start. Default "top 80%" */
  start?: string;
  /** Extra deps that should re-run the reveal setup */
  dependencies?: unknown[];
};

function isMainHeadingReveal(el: HTMLElement): boolean {
  if (el.hasAttribute("data-reveal-heading")) return true;
  const tag = el.tagName;
  if (tag === "H1" || tag === "H2") return true;
  /* Section intros: header wrapping the main title */
  if (tag === "HEADER" && el.querySelector("h1, h2")) return true;
  /*
   * Common pattern: data-reveal wrapper with eyebrow + h1/h2 (not card grids).
   * Only treat as heading when a top-level title is present and the block is small.
   */
  const title = el.querySelector(":scope > h1, :scope > h2");
  if (!title) return false;
  const directKids = el.querySelectorAll(":scope > *").length;
  return directKids > 0 && directKids <= 4;
}

/**
 * One ScrollTrigger-driven reveal per section (scoped via useGSAP).
 * Targets `[data-reveal]` as a group, and children of `[data-reveal-stagger]`
 * with a consistent stagger. Main headings ease in slowly from the left;
 * everything else keeps the existing fade-up. Skips under prefers-reduced-motion.
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
      const headingX = isCompactViewport() ? HEADING_X_MOBILE : HEADING_X_DESKTOP;
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

      const headingTargets = targets.filter(isMainHeadingReveal);
      const otherTargets = targets.filter((el) => !isMainHeadingReveal(el));

      const triggerVars = {
        trigger: section,
        start,
        once: true,
        toggleActions: "play none none none" as const,
      };

      const tweens: gsap.core.Tween[] = [];

      if (headingTargets.length) {
        gsap.set(headingTargets, { opacity: 0, x: -headingX, y: 0 });
        tweens.push(
          gsap.to(headingTargets, {
            opacity: 1,
            x: 0,
            duration: HEADING_DUR,
            ease: EASE_SOFT,
            stagger: headingTargets.length > 1 ? staggerAmt * 1.25 : 0,
            clearProps: "transform",
            scrollTrigger: triggerVars,
          }),
        );
      }

      if (otherTargets.length) {
        gsap.set(otherTargets, { opacity: 0, y });
        tweens.push(
          gsap.to(otherTargets, {
            opacity: 1,
            y: 0,
            duration: DUR,
            ease: EASE,
            stagger: otherTargets.length > 1 ? staggerAmt : 0,
            clearProps: "transform",
            scrollTrigger: triggerVars,
          }),
        );
      }

      // If the section is already past the start line (late mount / back-nav), finish now.
      // Avoid ScrollTrigger.refresh() here — N sections refreshing on mount causes scroll jumps.
      requestAnimationFrame(() => {
        for (const tween of tweens) {
          const st = tween.scrollTrigger;
          if (!st) continue;
          st.update();
          if (st.progress > 0 || st.isActive) {
            tween.progress(1);
            continue;
          }
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.85) {
            tween.play(0);
          }
        }
      });
    },
    {
      scope: sectionRef,
      dependencies: [reduceMotion, preloaderDone, start, ...dependencies],
    },
  );
}
