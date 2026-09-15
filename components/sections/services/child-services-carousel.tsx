"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

import type { ChildService } from "@/lib/data/services";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

import { CarouselArrows } from "./carousel-arrows";
import styles from "./services-section.module.css";

const COPIES = 2;
const SPEED_PX_PER_SEC = 40;
const STEP_PX = 240;
const NUDGE_LERP = 10;
const MOBILE_MQ = "(max-width: 767px)";

type ChildServicesCarouselProps = {
  items: ChildService[];
  active: boolean;
  className?: string;
};

function wrap(value: number, width: number) {
  if (width <= 0) return 0;
  const wrapped = value % width;
  return wrapped < 0 ? wrapped + width : wrapped;
}

/**
 * Nested child-service strip — seamless autoplay + smooth arrow nudges.
 * Loop width is measured from copy-to-copy DOM distance (avoids seam overlap).
 */
export function ChildServicesCarousel({
  items,
  active,
  className,
}: ChildServicesCarouselProps) {
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery(MOBILE_MQ);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const seqBRef = useRef<HTMLUListElement>(null);
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const loopWidthRef = useRef(0);
  const stepPxRef = useRef(STEP_PX);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  const applyDisplay = useCallback(() => {
    if (!trackRef.current) return;
    const width = loopWidthRef.current;
    const display = width > 0 ? wrap(offsetRef.current, width) : offsetRef.current;
    trackRef.current.style.transform = `translate3d(${-display}px,0,0)`;
  }, []);

  const measure = useCallback(() => {
    const seqA = seqRef.current;
    const seqB = seqBRef.current;
    const track = trackRef.current;
    if (!seqA || !track) return;

    const gapRaw =
      getComputedStyle(track).gap || getComputedStyle(track).columnGap;
    const gapPx = Number.parseFloat(gapRaw) || 0;
    const firstA = seqA.firstElementChild as HTMLElement | null;
    const itemW = firstA?.getBoundingClientRect().width ?? 0;
    if (itemW > 0) stepPxRef.current = itemW + gapPx;

    // Prefer real distance between identical points in copy A and B
    let next = 0;
    if (seqB && firstA) {
      const firstB = seqB.firstElementChild as HTMLElement | null;
      if (firstB) {
        next =
          firstB.getBoundingClientRect().left -
          firstA.getBoundingClientRect().left;
      }
    }
    if (next <= 1) {
      const seqWidth = seqA.getBoundingClientRect().width;
      next = seqWidth + gapPx;
    }

    if (next <= 0) return;
    if (Math.abs(next - loopWidthRef.current) < 0.5) return;

    const prev = loopWidthRef.current;
    if (prev > 0) offsetRef.current = wrap(offsetRef.current, prev);
    loopWidthRef.current = next;
    offsetRef.current = wrap(offsetRef.current, next);
    applyDisplay();
  }, [applyDisplay]);

  const scheduleResume = useCallback((ms: number) => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
      targetOffsetRef.current = null;
    }, ms);
  }, []);

  const nudge = useCallback(
    (direction: 1 | -1) => {
      const width = loopWidthRef.current;
      if (!width) return;
      pausedRef.current = true;
      const step = stepPxRef.current || STEP_PX;
      const base =
        targetOffsetRef.current != null
          ? targetOffsetRef.current
          : offsetRef.current;
      targetOffsetRef.current = base + direction * step;
      scheduleResume(2000);
    },
    [scheduleResume],
  );

  useEffect(() => {
    if (!active) return;
    measure();
    // Remeasure after expand / entrance layout settles (avoids stale loop width)
    const t1 = window.setTimeout(measure, 80);
    const t2 = window.setTimeout(measure, 420);
    const el = seqRef.current;
    const track = trackRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    if (track) ro.observe(track);
    return () => {
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [active, items, measure, isMobile]);

  useEffect(() => {
    if (!active || reduceMotion) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTsRef.current = null;
      offsetRef.current = 0;
      targetOffsetRef.current = null;
      loopWidthRef.current = 0;
      applyDisplay();
      return;
    }

    // Mobile: always autoplay when expanded. Desktop/tablet: same as before.
    pausedRef.current = false;

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;
      const width = loopWidthRef.current;

      if (targetOffsetRef.current != null && width > 0) {
        const target = targetOffsetRef.current;
        const diff = target - offsetRef.current;
        if (Math.abs(diff) < 0.4) {
          offsetRef.current = target;
          targetOffsetRef.current = null;
        } else {
          const t = 1 - Math.exp(-NUDGE_LERP * dt);
          offsetRef.current += diff * t;
        }
        applyDisplay();
      } else if (width > 0 && !pausedRef.current) {
        offsetRef.current += SPEED_PX_PER_SEC * dt;
        applyDisplay();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      if (resumeTimerRef.current != null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, [active, reduceMotion, applyDisplay]);

  return (
    <AnimatePresence initial={false}>
      {active ? (
        <motion.div
          key="children"
          className={cn(styles.childRail, className)}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => {
            // Pause on hover only for pointer devices (desktop/tablet)
            if (isMobile) return;
            pausedRef.current = true;
            targetOffsetRef.current = null;
          }}
          onMouseLeave={() => {
            if (isMobile) return;
            pausedRef.current = false;
          }}
        >
          <div className={styles.childRailHead}>
            <p className={styles.childRailLabel}>Sub-services</p>
            <CarouselArrows
              size="sm"
              label="Sub-services"
              onPrev={() => nudge(-1)}
              onNext={() => nudge(1)}
            />
          </div>

          <div className={styles.childViewport}>
            <div ref={trackRef} className={styles.childTrack}>
              {Array.from({ length: COPIES }, (_, copyIndex) => (
                <ul
                  key={`child-copy-${copyIndex}`}
                  ref={
                    copyIndex === 0
                      ? seqRef
                      : copyIndex === 1
                        ? seqBRef
                        : undefined
                  }
                  className={styles.childSequence}
                  role="list"
                  aria-hidden={copyIndex > 0 ? true : undefined}
                  inert={copyIndex > 0 ? true : undefined}
                >
                  {items.map((child, index) => (
                    <motion.li
                      key={`${copyIndex}-${child.id}`}
                      className={styles.childItem}
                      initial={
                        copyIndex === 0 ? { opacity: 0, y: 18 } : false
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: copyIndex === 0 ? 0.1 + index * 0.07 : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <span className={styles.childIndex}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.childLabel}>{child.label}</span>
                      <span className={styles.childSummary}>
                        {child.summary}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
