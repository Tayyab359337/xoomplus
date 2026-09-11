"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useAnimation } from "@/components/animations/AnimationProvider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { EASE_OUT_EXPO, gsap, registerGsapPlugins } from "@/lib/animations";

/**
 * Cinematic Hero assemble — overlapping timeline positions.
 * Primary heading stays visible HTML (LCP-safe) — never opacity:0.
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
      const eyebrow = hero.querySelector<HTMLElement>("[data-hero-eyebrow]");
      const body = hero.querySelector<HTMLElement>("[data-hero-body]");
      const actions = hero.querySelector<HTMLElement>("[data-hero-actions]");
      const visuals = hero.querySelectorAll<HTMLElement>("[data-hero-visual]");
      const heading = hero.querySelector<HTMLElement>("[data-lcp]");

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT_EXPO } });

      // Overlapping assemble — not sequential drops
      if (nav.length) {
        tl.from(nav, { y: -8, duration: 0.55, clearProps: "transform" }, 0);
      }

      if (eyebrow) {
        tl.from(
          eyebrow,
          { y: 12, duration: 0.55, clearProps: "transform" },
          0.0,
        );
      }

      if (heading) {
        tl.from(
          heading,
          { y: 8, duration: 0.65, clearProps: "transform" },
          0.05,
        );
      }

      if (visuals.length) {
        tl.from(
          visuals,
          {
            opacity: 0.5,
            scale: 1.02,
            duration: 0.85,
            stagger: 0.04,
            clearProps: "transform,opacity",
          },
          0.15,
        );
      }

      if (body) {
        tl.from(
          body,
          { y: 16, duration: 0.65, clearProps: "transform" },
          0.18,
        );
      }

      if (actions) {
        const kids = actions.querySelectorAll(":scope > *");
        tl.from(
          kids,
          { y: 14, duration: 0.55, stagger: 0.06, clearProps: "transform" },
          0.28,
        );
      }
    },
    { dependencies: [preloaderDone, reduceMotion] },
  );

  return null;
}
