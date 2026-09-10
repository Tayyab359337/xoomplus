"use client";

import { useReducedMotion as useMotionReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Prefers-reduced-motion aware helper.
 * Returns true when motion should be minimized or disabled.
 */
export function usePrefersReducedMotion(): boolean {
  const motionPreference = useMotionReducedMotion();
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return Boolean(motionPreference) || matches;
}
