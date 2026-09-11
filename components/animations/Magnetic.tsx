"use client";

import { useGSAP } from "@gsap/react";
import {
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  attachMagnetic,
  featureEnabled,
  resolveMotionTier,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

type MagneticProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  strength?: number;
  asChild?: boolean;
};

/**
 * Desktop magnetic pull wrapper. No-op on touch / reduced motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.28,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduceMotion) return;
      const tier = resolveMotionTier({
        reducedMotion: reduceMotion,
        width: window.innerWidth,
      });
      if (!featureEnabled("magnetic", tier)) return;
      return attachMagnetic(el, { strength });
    },
    { dependencies: [reduceMotion, strength] },
  );

  return (
    <div ref={ref} className={cn("inline-flex", className)} {...rest}>
      {children}
    </div>
  );
}
