"use client";

import { useEffect, useState } from "react";

import GradualBlur from "@/components/GradualBlur";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Fixed viewport-bottom GradualBlur — content softens as it scrolls under the edge.
 * Kept visually close to the original, but with far fewer backdrop-filter layers
 * (the previous 6-layer stack was a primary scroll-jank source).
 */
export function PageBottomBlur() {
  const reduceMotion = usePrefersReducedMotion();
  const [layers, setLayers] = useState(3);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const sync = () => setLayers(mq.matches ? 2 : 3);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (reduceMotion) return null;

  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="7.5rem"
      strength={1.65}
      divCount={layers}
      curve="bezier"
      exponential
      opacity={1}
      animated={false}
      zIndex={30}
      /* Override page-target (+100) so blur stays under the header / mobile nav */
      style={{ zIndex: 40, contain: "strict", transform: "translateZ(0)" }}
      className="page-bottom-gradual-blur"
    />
  );
}
