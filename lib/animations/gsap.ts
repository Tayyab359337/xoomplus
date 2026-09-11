import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ANIMATION_DEBUG } from "./config";

/**
 * Central GSAP bootstrap.
 * Register plugins once so production tree-shaking keeps ScrollTrigger.
 */

/** @deprecated use ANIMATION_DEBUG from config */
export const ENABLE_ANIMATION_DEBUG = ANIMATION_DEBUG;

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
