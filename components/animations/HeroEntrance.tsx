"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useAnimation } from "@/components/animations/AnimationProvider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { EASE_OUT_EXPO, gsap, registerGsapPlugins } from "@/lib/animations";

/**
 * Lightweight hero polish after first paint.
 * Never animates `[data-lcp]` or `[data-hero-body]` — those must paint immediately for LCP.
 */
export function HeroEntrance() {
  const reduceMotion = usePrefersReducedMotion();
  const { preloaderDone } = useAnimation();
  const ran = useRef(false);

  useGSAP(
    () => {
      if (!preloaderDone || reduceMotion || ran.current) return;

      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!hero) return;

      ran.current = true;
      registerGsapPlugins();

      const nav = document.querySelectorAll<HTMLElement>("[data-nav-entrance]");
      const trust = hero.querySelector<HTMLElement>("[data-hero-trust]");
      const actions = hero.querySelector<HTMLElement>("[data-hero-actions]");
      const visuals = hero.querySelectorAll<HTMLElement>("[data-hero-visual]");

      const run = () => {
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT_EXPO } });

        if (nav.length) {
          tl.from(nav, { y: -8, duration: 0.55, clearProps: "transform" }, 0);
        }

        if (visuals.length) {
          tl.from(
            visuals,
            {
              opacity: 0.65,
              duration: 0.7,
              stagger: 0.04,
              clearProps: "opacity",
            },
            0.08,
          );
        }

        if (trust) {
          tl.from(
            trust,
            { y: 10, duration: 0.5, clearProps: "transform" },
            0.12,
          );
        }

        if (actions) {
          const kids = actions.querySelectorAll(":scope > *");
          tl.from(
            kids,
            { y: 12, duration: 0.5, stagger: 0.05, clearProps: "transform" },
            0.16,
          );
        }
      };

      // Defer until after first paint so LCP text is not competing with GSAP.
      let idleId = 0;
      let timeoutId = 0;
      const start = () => {
        requestAnimationFrame(() => requestAnimationFrame(run));
      };

      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(start, { timeout: 900 });
      } else {
        timeoutId = window.setTimeout(start, 1);
      }

      return () => {
        if (idleId && typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        }
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    },
    { dependencies: [preloaderDone, reduceMotion] },
  );

  return null;
}
