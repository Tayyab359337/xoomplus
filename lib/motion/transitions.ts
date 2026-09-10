import type { Transition } from "motion/react";

/** Shared easing — premium, no bounce */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeOutQuart: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const transitions = {
  fast: {
    duration: 0.2,
    ease: easeOutQuart,
  } satisfies Transition,
  base: {
    duration: 0.5,
    ease: easeOutExpo,
  } satisfies Transition,
  slow: {
    duration: 0.75,
    ease: easeOutExpo,
  } satisfies Transition,
  springSoft: {
    type: "spring",
    stiffness: 220,
    damping: 28,
    mass: 0.9,
  } satisfies Transition,
} as const;

export const durations = {
  fast: 0.2,
  base: 0.5,
  slow: 0.75,
  stagger: 0.07,
  delayChildren: 0.1,
} as const;
