"use client";

import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const BACKGROUND_COLORS = [
  "var(--background)",
  "var(--background)",
  "var(--background)",
] as const;

const PANEL_TONES = [
  "color-mix(in srgb, var(--muted) 55%, var(--background))",
  "color-mix(in srgb, var(--muted) 70%, var(--background))",
  "color-mix(in srgb, var(--card) 80%, var(--muted))",
] as const;

/**
 * Aceternity Sticky Scroll Reveal — adapted for page scroll + Xoomplus tokens.
 * Core active-card / opacity reveal logic is unchanged.
 */
export const StickyScroll = ({
  content,
  contentClassName,
  className,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
  className?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    // Page scroll (works with Lenis) — not nested overflow container
    target: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundGradient = PANEL_TONES[activeCard % PANEL_TONES.length];

  return (
    <motion.div
      animate={{
        backgroundColor: BACKGROUND_COLORS[activeCard % BACKGROUND_COLORS.length],
      }}
      className={cn(
        "relative flex justify-center space-x-10 rounded-md py-4 lg:space-x-14 lg:py-6",
        className,
      )}
      ref={ref}
    >
      <div className="relative flex items-start px-1 lg:px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-16 lg:my-24">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.28,
                }}
                className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
              >
                {item.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.28,
                }}
                className="mt-5 max-w-sm font-sans text-base leading-relaxed text-muted-foreground md:text-[1.05rem]"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-28 lg:h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-28 hidden h-72 w-80 overflow-hidden rounded-md border border-border/70 lg:block xl:h-80 xl:w-96",
          contentClassName,
        )}
      >
        {content[activeCard]?.content ?? null}
      </div>
    </motion.div>
  );
};
