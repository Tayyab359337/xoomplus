"use client";

import GradualBlur from "@/components/GradualBlur";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Fixed viewport-bottom GradualBlur — content softens as it scrolls under the edge.
 */
export function PageBottomBlur() {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) return null;

  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="7.5rem"
      strength={2.25}
      divCount={6}
      curve="bezier"
      exponential
      opacity={1}
      animated="scroll"
      duration="0.45s"
      easing="ease-out"
      zIndex={30}
      /* Override page-target (+100) so blur stays under the header / mobile nav */
      style={{ zIndex: 40 }}
      className="page-bottom-gradual-blur"
    />
  );
}
