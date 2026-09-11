"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const COMPACT_MQ = "(max-width: 768px)";
const FINE_MQ = "(pointer: fine)";
const COARSE_MQ = "(pointer: coarse)";

/**
 * Whether the lightweight custom cursor should run.
 * Fine pointer + desktop only; never on touch / reduced-motion.
 */
export function useCustomCursorEnabled(): boolean {
  const reduceMotion = usePrefersReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const update = () => {
      const fine = window.matchMedia(FINE_MQ).matches;
      const coarse = window.matchMedia(COARSE_MQ).matches;
      const compact = window.matchMedia(COMPACT_MQ).matches;
      setCapable(fine && !coarse && !compact);
    };

    update();

    const fine = window.matchMedia(FINE_MQ);
    const coarse = window.matchMedia(COARSE_MQ);
    const compact = window.matchMedia(COMPACT_MQ);
    fine.addEventListener("change", update);
    coarse.addEventListener("change", update);
    compact.addEventListener("change", update);

    return () => {
      fine.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
      compact.removeEventListener("change", update);
    };
  }, []);

  return !reduceMotion && capable;
}
