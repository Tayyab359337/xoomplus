import type { gsap } from "gsap";

import { motionConfig, resolveMotionTier } from "./config";
import { isCompactViewport, prefersReducedMotion } from "./gsap";

/** Shared easing — premium, no bounce */
export const EASE_OUT_EXPO = "power3.out";
export const EASE_OUT_SOFT = "power2.out";
export const EASE_EDITORIAL = "power3.out";

export type AnimateKind =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "stagger"
  | "image-reveal"
  | "clip"
  | "parallax";

/** Alias — data-motion uses the same vocabulary */
export type MotionKind = AnimateKind;

export type PresetVars = gsap.TweenVars;

function currentTier() {
  return resolveMotionTier({
    reducedMotion: prefersReducedMotion(),
    width: typeof window !== "undefined" ? window.innerWidth : 1440,
  });
}

function distance(desktop: number, mobile = desktop * 0.5): number {
  const tier = currentTier();
  if (tier === "reduced") return 0;
  if (tier === "mobile" || isCompactViewport()) return mobile;
  if (tier === "tablet") return Math.round(desktop * 0.7);
  return desktop;
}

export const durations = motionConfig.durations;

/** Initial / from state for data-animate / data-motion kinds */
export function getFromVars(kind: AnimateKind): PresetVars {
  const y = distance(motionConfig.revealY.desktop, motionConfig.revealY.mobile);
  const x = distance(32, 16);
  const imageScale = motionConfig.imageScaleFrom[currentTier()];

  switch (kind) {
    case "fade":
      return { opacity: 0 };
    case "fade-up":
      return { opacity: 0, y };
    case "fade-down":
      return { opacity: 0, y: -y };
    case "fade-left":
      return { opacity: 0, x };
    case "fade-right":
      return { opacity: 0, x: -x };
    case "scale":
      return { opacity: 0, scale: 0.96 };
    case "stagger":
      return { opacity: 0, y: distance(24, 14) };
    case "image-reveal":
      return { scale: imageScale, y: distance(18, 10) };
    case "clip":
      return { clipPath: "inset(100% 0 0 0)", y: distance(24, 12) };
    case "parallax":
      return {};
    default:
      return { opacity: 0, y };
  }
}

export function getToVars(kind: AnimateKind): PresetVars {
  if (kind === "clip") {
    return {
      clipPath: "inset(0% 0 0 0)",
      y: 0,
      duration: durations.entrance,
      ease: EASE_EDITORIAL,
      clearProps: "clip-path,transform",
    };
  }

  const base: PresetVars = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: kind === "image-reveal" ? durations.image : durations.entrance,
    ease: EASE_OUT_EXPO,
    clearProps: "transform",
  };

  if (kind === "image-reveal") {
    return { ...base, clearProps: "transform" };
  }

  return base;
}

/** Named presets for imperative use */
export const presets = {
  fadeUp: {
    from: { opacity: 0, y: 28 },
    to: { opacity: 1, y: 0, duration: durations.entrance, ease: EASE_OUT_EXPO },
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: durations.entrance, ease: EASE_OUT_SOFT },
  },
  slideUp: {
    from: { y: 36, opacity: 0 },
    to: { y: 0, opacity: 1, duration: durations.entrance, ease: EASE_OUT_EXPO },
  },
  slideIn: {
    from: { x: 28, opacity: 0 },
    to: { x: 0, opacity: 1, duration: durations.entrance, ease: EASE_OUT_EXPO },
  },
  staggerReveal: {
    from: { opacity: 0, y: 20 },
    to: {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: EASE_OUT_EXPO,
      stagger: 0.08,
    },
  },
  imageReveal: {
    from: { scale: 1.08, y: 14 },
    to: { scale: 1, y: 0, duration: durations.image, ease: EASE_OUT_EXPO },
  },
  subtleParallax: {
    yDesktop: motionConfig.parallaxY.desktop,
    yMobile: motionConfig.parallaxY.mobile,
  },
} as const;
