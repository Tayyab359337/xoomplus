"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { hoverLift, hoverScale, transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

type HoverProps = {
  children: ReactNode;
  className?: string;
  mode?: "lift" | "scale";
} & Omit<HTMLMotionProps<"div">, "children" | "variants">;

/** Lightweight hover micro-interaction wrapper. */
export function Hover({
  children,
  className,
  mode = "lift",
  ...rest
}: HoverProps) {
  const reduceMotion = usePrefersReducedMotion();
  const variants = mode === "scale" ? hoverScale : hoverLift;

  if (reduceMotion) {
    return (
      <div className={cn(className)} {...(rest as Record<string, unknown>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="rest"
      whileHover="hover"
      transition={transitions.fast}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
