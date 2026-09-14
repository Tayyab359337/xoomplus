"use client";

import { motion, useScroll, useTransform, useMotionValue } from "motion/react";
import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

type TimelineProps = {
  data: TimelineEntry[];
  /** Optional built-in header; omit when the parent section already has an intro. */
  title?: string;
  description?: string;
  className?: string;
};

/**
 * Aceternity Timeline — scroll progress drives the beam.
 * Height is a MotionValue (no React re-renders on measure) for smooth scrubbing.
 */
export function Timeline({
  data,
  title,
  description,
  className,
}: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heightMv = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // offsetHeight avoids layout thrash from sticky getBoundingClientRect during scroll
        const next = el.offsetHeight;
        if (Math.abs(next - heightMv.get()) > 2) {
          heightMv.set(next);
        }
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Images / fonts settling
    const imgs = el.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure, { once: true });
    });

    window.addEventListener("resize", measure, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [data, heightMv]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(
    [scrollYProgress, heightMv],
    ([progress, h]) => (progress as number) * (h as number),
  );
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full bg-background font-sans md:px-10", className)}
    >
      {(title || description) && (
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
          {title ? (
            <h2 className="type-h2 mb-4 max-w-4xl text-foreground">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="type-body max-w-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      )}

      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex justify-start pt-10 md:gap-10 md:pt-40"
          >
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-background md:left-3">
                <div className="h-4 w-4 rounded-full border border-border bg-muted p-2" />
              </div>
              <h3 className="type-h3 hidden text-muted-foreground md:block md:pl-20">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="type-h3 mb-4 block text-left text-muted-foreground md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        <motion.div
          style={{ height: heightMv }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-primary via-accent to-transparent from-[0%] via-[10%]"
          />
        </motion.div>
      </div>
    </div>
  );
}
