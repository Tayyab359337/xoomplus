"use client";

import { useGSAP } from "@gsap/react";
import {
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { attachHoverLift } from "@/lib/animations/hover";
import { cn } from "@/lib/utils";

type HoverLiftProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  y?: number;
  scale?: number;
};

/**
 * Subtle GSAP quickTo hover lift. No-op under reduced motion / coarse pointers.
 */
export function HoverLift({
  children,
  className,
  y = -4,
  scale = 1.015,
  ...rest
}: HoverLiftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduceMotion) return;
      if (window.matchMedia("(hover: none)").matches) return;
      return attachHoverLift(el, { y, scale });
    },
    { dependencies: [reduceMotion, y, scale] },
  );

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
