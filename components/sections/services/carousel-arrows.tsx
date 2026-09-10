"use client";

import { cn } from "@/lib/utils";

import styles from "./services-section.module.css";

type CarouselArrowsProps = {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  /** Visually quieter variant for nested child rails */
  size?: "md" | "sm";
  label?: string;
};

/**
 * Sleek prev/next controls shared by parent + child service carousels.
 */
export function CarouselArrows({
  onPrev,
  onNext,
  className,
  size = "md",
  label = "Carousel",
}: CarouselArrowsProps) {
  return (
    <div
      className={cn(styles.arrows, size === "sm" && styles.arrowsSm, className)}
      role="group"
      aria-label={`${label} controls`}
    >
      <button
        type="button"
        className={styles.arrowBtn}
        aria-label={`${label}: previous`}
        data-carousel-arrow
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span className={styles.arrowIcon} data-dir="prev" aria-hidden />
      </button>
      <button
        type="button"
        className={styles.arrowBtn}
        aria-label={`${label}: next`}
        data-carousel-arrow
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span className={styles.arrowIcon} data-dir="next" aria-hidden />
      </button>
    </div>
  );
}
