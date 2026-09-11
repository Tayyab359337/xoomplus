import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ANIMATION_DEBUG, motionConfig } from "./config";

/**
 * Central GSAP bootstrap.
 * Register plugins once so production tree-shaking keeps ScrollTrigger.
 * Shared timing/easing — import from here; do not re-register per component.
 */

/** @deprecated use ANIMATION_DEBUG from config */
export const ENABLE_ANIMATION_DEBUG = ANIMATION_DEBUG;

/** Shared motion constants — reuse across every section reveal / hover */
export const EASE = "power3.out";
export const EASE_SOFT = "power2.out";
export const DUR = motionConfig.durations.entrance;
export const DUR_HOVER = motionConfig.durations.hoverIn;
export const DUR_HOVER_OUT = motionConfig.durations.hoverOut;
export const REVEAL_Y = motionConfig.revealY.desktop;
export const STAGGER = motionConfig.stagger.desktop;
export const SCROLL_START = "top 80%";

let pluginsRegistered = false;

export function registerGsapPlugins(): typeof gsap {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    pluginsRegistered = true;
  }

  if (ANIMATION_DEBUG && typeof window !== "undefined") {
    ScrollTrigger.defaults({ markers: true });
  }

  return gsap;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCompactViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export { gsap, ScrollTrigger };
