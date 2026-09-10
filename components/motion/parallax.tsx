"use client";

import {
  motion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { useRef, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Max translateY in px (positive = moves down as you scroll) */
  offset?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "style">;

/**
 * Subtle scroll parallax via transform only.
 * Disabled under prefers-reduced-motion — no layout shift.
 */
export function Parallax({
  children,
  className,
  offset = 48,
  ...rest
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduceMotion) {
    return (
      <div className={cn(className)} {...(rest as Record<string, unknown>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{ y }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
