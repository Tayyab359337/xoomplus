"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  fadeUp,
  motionVariants,
  type MotionVariantName,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: MotionVariantName;
  /** When true, animate once after entering viewport */
  once?: boolean;
  amount?: number | "some" | "all";
  delay?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "variants">;

/**
 * Scroll-triggered reveal using shared motion variants.
 * Falls back to a static element when reduced motion is preferred.
 */
export function Reveal({
  children,
  className,
  variant = "fadeUp",
  once = true,
  amount = 0.2,
  delay = 0,
  ...rest
}: RevealProps) {
  const reduceMotion = usePrefersReducedMotion();
  const variants = motionVariants[variant] ?? fadeUp;

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
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
