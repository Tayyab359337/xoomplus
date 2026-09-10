"use client";

import type { ElementType, HTMLAttributes, ReactNode } from "react";

import {
  getScrollAttrs,
  type ScrollEffectOptions,
} from "@/lib/scroll";
import { cn } from "@/lib/utils";

type ScrollItemProps = ScrollEffectOptions & {
  children: ReactNode;
  className?: string;
  as?: ElementType;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Convenience wrapper that applies Locomotive `data-scroll*` attributes.
 * Use for section-level control without hand-writing attribute maps.
 */
export function ScrollItem({
  children,
  className,
  as: Tag = "div",
  speed,
  offset,
  position,
  cssProgress,
  eventProgress,
  class: scrollClass,
  repeat,
  call,
  ignoreFold,
  enableTouchSpeed,
  ...rest
}: ScrollItemProps) {
  const attrs = getScrollAttrs({
    speed,
    offset,
    position,
    cssProgress,
    eventProgress,
    class: scrollClass,
    repeat,
    call,
    ignoreFold,
    enableTouchSpeed,
  });

  return (
    <Tag className={cn(className)} {...attrs} {...rest}>
      {children}
    </Tag>
  );
}
