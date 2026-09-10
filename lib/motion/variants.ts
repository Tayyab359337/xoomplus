import type { Variants } from "motion/react";

import { durations, transitions } from "./transitions";

/** Fade + slight rise — default section/content reveal */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

/** Soft fade only — for overlays / secondary content */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.base,
  },
};

/** Controlled scale-in — imagery / media frames */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.slow,
  },
};

/** Horizontal slide — asymmetric editorial entrances */
export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.base,
  },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.base,
  },
};

/** Parent container for staggered children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: durations.stagger,
      delayChildren: durations.delayChildren,
    },
  },
};

/** Faster stagger for nav / meta lines */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.06,
    },
  },
};

/** Child item used inside stagger containers */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

/** Line / word reveal for headlines */
export const textReveal: Variants = {
  hidden: { opacity: 0, y: "110%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: transitions.slow,
  },
};

/** Hover micro-interactions — transform/opacity only */
export const hoverLift = {
  rest: { y: 0 },
  hover: {
    y: -2,
    transition: transitions.fast,
  },
} satisfies Variants;

export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
} satisfies Variants;

export const motionVariants = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideInFromLeft,
  slideInFromRight,
  staggerContainer,
  staggerFast,
  staggerItem,
  textReveal,
  hoverLift,
  hoverScale,
} as const;

export type MotionVariantName = keyof typeof motionVariants;
