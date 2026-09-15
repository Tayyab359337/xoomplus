"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { ServiceCategory } from "@/lib/data/services";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

import { CarouselArrows } from "./carousel-arrows";
import { ServiceCard } from "./service-card";
import styles from "./services-section.module.css";

/** Two identical sequences — wrap at sequence width + track gap for a seamless loop. */
const COPIES = 2;
const SPEED_PX_PER_SEC = 48;
const DRAG_THRESHOLD = 8;
const STEP_PX_DESKTOP = 320;
const NUDGE_LERP = 10; // higher = snappier arrow glide
const MOBILE_MQ = "(max-width: 767px)";

type ServicesInfiniteCarouselProps = {
  services: ServiceCategory[];
  interaction: "hover" | "tap";
  className?: string;
};

function wrap(value: number, width: number) {
  if (width <= 0) return 0;
  const wrapped = value % width;
  return wrapped < 0 ? wrapped + width : wrapped;
}

/**
 * Seamless infinite track — continuous offset, wrap only for display.
 * Mobile: no autoplay, one card per view, snap + arrow step by card width.
 */
export function ServicesInfiniteCarousel({
  services,
  interaction,
  className,
}: ServicesInfiniteCarouselProps) {
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery(MOBILE_MQ);
  const isMobileRef = useRef(isMobile);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const loopWidthRef = useRef(0);
  const stepPxRef = useRef(STEP_PX_DESKTOP);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragArmedRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const expandedKeyRef = useRef<string | null>(null);
  const resumeTimerRef = useRef<number | null>(null);

  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    expandedKeyRef.current = expandedKey;
  }, [expandedKey]);

  useEffect(() => {
    isMobileRef.current = isMobile;
    // Mobile never autoplays; keep paused when switching down to mobile
    if (isMobile) {
      pausedRef.current = true;
      if (resumeTimerRef.current != null) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    } else if (!expandedKeyRef.current && !draggingRef.current) {
      pausedRef.current = false;
    }
  }, [isMobile]);

  const applyDisplay = useCallback(() => {
    if (!trackRef.current) return;
    const width = loopWidthRef.current;
    const display = width > 0 ? wrap(offsetRef.current, width) : offsetRef.current;
    trackRef.current.style.transform = `translate3d(${-display}px,0,0)`;
  }, []);

  const measure = useCallback(() => {
    if (expandedKeyRef.current) return;
    const seq = seqRef.current;
    const track = trackRef.current;
    if (!seq || !track) return;

    const seqWidth = seq.getBoundingClientRect().width;
    const gapRaw = getComputedStyle(track).gap || getComputedStyle(track).columnGap;
    const gap = Number.parseFloat(gapRaw) || 0;
    const firstCard = seq.firstElementChild as HTMLElement | null;
    const cardW = firstCard?.getBoundingClientRect().width ?? 0;
    if (cardW > 0) {
      stepPxRef.current = cardW + gap;
    } else if (!isMobileRef.current) {
      stepPxRef.current = STEP_PX_DESKTOP;
    }

    // Distance from start of copy A to start of copy B
    const next = seqWidth + gap;
    if (next <= 0) return;
    if (Math.abs(next - loopWidthRef.current) < 0.5) return;

    // Keep visual position stable when loop width is recalculated
    const prev = loopWidthRef.current;
    if (prev > 0) {
      offsetRef.current = wrap(offsetRef.current, prev);
    }
    loopWidthRef.current = next;
    offsetRef.current = wrap(offsetRef.current, next);
    applyDisplay();
  }, [applyDisplay]);

  const scheduleResume = useCallback((ms: number) => {
    if (isMobileRef.current) return;
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      if (
        !isMobileRef.current &&
        !expandedKeyRef.current &&
        !draggingRef.current
      ) {
        pausedRef.current = false;
        targetOffsetRef.current = null;
      }
    }, ms);
  }, []);

  const snapToNearestCard = useCallback(() => {
    const step = stepPxRef.current;
    const width = loopWidthRef.current;
    if (!step || !width) return;
    const current = wrap(offsetRef.current, width);
    const nearest = Math.round(current / step) * step;
    const delta = nearest - current;
    offsetRef.current = current;
    targetOffsetRef.current = current + delta;
  }, []);

  const nudge = useCallback(
    (direction: 1 | -1) => {
      const width = loopWidthRef.current;
      if (!width || expandedKeyRef.current) return;
      pausedRef.current = true;
      const step = stepPxRef.current || STEP_PX_DESKTOP;
      const base =
        targetOffsetRef.current != null
          ? targetOffsetRef.current
          : offsetRef.current;
      targetOffsetRef.current = base + direction * step;
      scheduleResume(2200);
    },
    [scheduleResume],
  );

  useEffect(() => {
    measure();
    const el = seqRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, services, isMobile]);

  useEffect(() => {
    pausedRef.current =
      isMobile || Boolean(expandedKey) || draggingRef.current;
    if (expandedKey) {
      targetOffsetRef.current = null;
    } else {
      requestAnimationFrame(() => measure());
    }
  }, [expandedKey, measure, isMobile]);

  useEffect(() => {
    if (!expandedKey || interaction !== "tap") return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest(`[data-services-card="${expandedKey}"]`)) return;
      if (target.closest("[data-carousel-arrow]")) return;
      setExpandedKey(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [expandedKey, interaction]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (reduceMotion) {
      track.style.transform = "translate3d(0,0,0)";
      return;
    }

    const shell =
      track.closest(`.${styles.carouselShell}`) ?? track.parentElement;
    let inView = true;

    const stop = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };

    const tick = (ts: number) => {
      if (!inView) {
        stop();
        return;
      }

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
          // Frame-rate independent ease toward arrow target
          const t = 1 - Math.exp(-NUDGE_LERP * dt);
          offsetRef.current += diff * t;
        }
        applyDisplay();
      } else if (
        width > 0 &&
        !pausedRef.current &&
        !isMobileRef.current
      ) {
        offsetRef.current += SPEED_PX_PER_SEC * dt;
        applyDisplay();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafRef.current != null || !inView) return;
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    };

    const io =
      shell && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              if (inView) start();
              else stop();
            },
            { rootMargin: "120px 0px" },
          )
        : null;
    if (shell && io) io.observe(shell);
    start();

    return () => {
      io?.disconnect();
      stop();
      if (resumeTimerRef.current != null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, [reduceMotion, applyDisplay]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (expandedKey) return;
    dragArmedRef.current = true;
    draggingRef.current = false;
    didDragRef.current = false;
    dragStartXRef.current = event.clientX;
    // Use displayed offset so drag feels continuous across wraps
    dragStartOffsetRef.current = wrap(
      offsetRef.current,
      loopWidthRef.current || 1,
    );
    targetOffsetRef.current = null;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragArmedRef.current || !loopWidthRef.current) return;
    const delta = dragStartXRef.current - event.clientX;
    if (!draggingRef.current && Math.abs(delta) < DRAG_THRESHOLD) return;
    if (!draggingRef.current) {
      draggingRef.current = true;
      didDragRef.current = true;
      pausedRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    offsetRef.current = dragStartOffsetRef.current + delta;
    applyDisplay();
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragArmedRef.current && !draggingRef.current) return;
    const wasDragging = draggingRef.current;
    dragArmedRef.current = false;
    if (draggingRef.current) {
      draggingRef.current = false;
      // Normalize into one loop cycle without a visual jump
      offsetRef.current = wrap(offsetRef.current, loopWidthRef.current);
      applyDisplay();
      if (isMobileRef.current) {
        pausedRef.current = true;
        snapToNearestCard();
      } else {
        pausedRef.current = Boolean(expandedKey);
        scheduleResume(900);
      }
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }
    if (wasDragging) {
      window.setTimeout(() => {
        didDragRef.current = false;
      }, 50);
    } else {
      didDragRef.current = false;
    }
  };

  return (
    <div
      className={cn(styles.carouselShell, className)}
      data-mobile-single={isMobile ? "true" : undefined}
    >
      <CarouselArrows
        className={styles.carouselArrows}
        label="Services"
        onPrev={() => nudge(-1)}
        onNext={() => nudge(1)}
      />

      <div
        className={styles.carousel}
        data-xp-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className={styles.track}>
          {Array.from({ length: COPIES }, (_, copyIndex) => (
            <div
              key={`copy-${copyIndex}`}
              ref={copyIndex === 0 ? seqRef : undefined}
              className={styles.sequence}
              aria-hidden={copyIndex > 0 ? true : undefined}
            >
              {services.map((service) => {
                const instanceKey = `${copyIndex}-${service.id}`;
                return (
                  <ServiceCard
                    key={instanceKey}
                    instanceKey={instanceKey}
                    service={service}
                    expanded={expandedKey === instanceKey}
                    secondary={
                      Boolean(expandedKey) && expandedKey !== instanceKey
                    }
                    interaction={interaction}
                    onExpand={setExpandedKey}
                    suppressToggle={didDragRef}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
