"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";

import type { Testimonial } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

import styles from "./infinite-moving-cards.module.css";

export type InfiniteMovingCardsProps = {
  items: Testimonial[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
};

const speedDuration: Record<
  NonNullable<InfiniteMovingCardsProps["speed"]>,
  string
> = {
  fast: "32s",
  normal: "52s",
  slow: "78s",
};

/** Repeat the list until we have enough cards for a seamless, gap-free loop. */
function buildLoopItems(items: Testimonial[], minCount = 8): Testimonial[] {
  if (items.length === 0) return [];
  const out: Testimonial[] = [];
  let i = 0;
  while (out.length < minCount) {
    out.push(items[i % items.length]!);
    i += 1;
  }
  return out;
}

/**
 * Aceternity-style infinite marquee — true seamless loop via duplicated sets.
 * Token-based; no hard-coded theme colors. Pauses off-screen to save CPU.
 */
export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const loopItems = useMemo(() => buildLoopItems(items), [items]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        root.dataset.inView = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "80px 0px" },
    );
    root.dataset.inView = "true";
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const style = {
    "--animation-duration": speedDuration[speed],
  } as CSSProperties;

  return (
    <div
      ref={scrollerRef}
      className={cn(styles.scroller, className)}
      style={style}
      data-direction={direction}
      data-pause-hover={pauseOnHover ? "true" : "false"}
      data-in-view="true"
    >
      <ul
        className={styles.track}
        data-direction={direction}
        data-pause-hover={pauseOnHover ? "true" : "false"}
      >
        {[0, 1].map((copy) => (
          <li key={`set-${copy}`} className={styles.set} aria-hidden={copy === 1}>
            <ul className={styles.setList}>
              {loopItems.map((item, index) => (
                <li
                  key={`${copy}-${item.id}-${index}`}
                  className={styles.card}
                >
                  <blockquote className={styles.blockquote}>
                    <p className={styles.quote}>{item.quote}</p>
                    <footer className={styles.footer}>
                      {item.avatar ? (
                        <span className={styles.avatar}>
                          <Image
                            src={item.avatar}
                            alt={copy === 0 ? (item.avatarAlt ?? "") : ""}
                            width={40}
                            height={40}
                            className={styles.avatarImage}
                          />
                        </span>
                      ) : null}
                      <span className={styles.meta}>
                        <span className={styles.name}>{item.name}</span>
                        {item.role || item.company ? (
                          <span className={styles.role}>
                            {item.role}
                            {item.role && item.company ? (
                              <span className={styles.dot} aria-hidden>
                                ·
                              </span>
                            ) : null}
                            {item.company}
                          </span>
                        ) : null}
                      </span>
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InfiniteMovingCards;
