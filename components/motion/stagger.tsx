"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { staggerContainer, staggerFast, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  fast?: boolean;
  once?: boolean;
  amount?: number | "some" | "all";
} & Omit<HTMLMotionProps<"div">, "children" | "variants">;

/** Parent that staggers child entrances on scroll. */
export function Stagger({
  children,
  className,
  fast = false,
  once = true,
  amount = 0.2,
  ...rest
}: StaggerProps) {
  const reduceMotion = usePrefersReducedMotion();

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
      variants={fast ? staggerFast : staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "variants">;

/** Child of `Stagger` — apply to each staggered block. */
export function StaggerItem({
  children,
  className,
  ...rest
}: StaggerItemProps) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return (
      <div className={cn(className)} {...(rest as Record<string, unknown>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={cn(className)} variants={staggerItem} {...rest}>
      {children}
    </motion.div>
  );
}
