"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { GraphicDesignSubService } from "@/lib/data/graphic-design-sub-services";
import { cn } from "@/lib/utils";

import styles from "./graphic-design-sub-services.module.css";

type GraphicDesignSubServicesCarouselProps = {
  services: GraphicDesignSubService[];
  className?: string;
};

/**
 * Mobile/tablet carousel — one service card per snap, swipe + arrows.
 */
export function GraphicDesignSubServicesCarousel({
  services,
  className,
}: GraphicDesignSubServicesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const syncIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-card]");
    if (!card) return;
    const step = card.offsetWidth + 16;
    if (step <= 0) return;
    const next = Math.round(track.scrollLeft / step);
    setIndex(Math.max(0, Math.min(services.length - 1, next)));
  }, [services.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", syncIndex, { passive: true });
    return () => track.removeEventListener("scroll", syncIndex);
  }, [syncIndex]);

  const scrollToIndex = useCallback((next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-card]");
    if (!card) return;
    const step = card.offsetWidth + 16;
    const clamped = Math.max(0, Math.min(services.length - 1, next));
    track.scrollTo({ left: clamped * step, behavior: "smooth" });
    setIndex(clamped);
  }, [services.length]);

  const onPrev = useCallback(() => {
    scrollToIndex(index - 1);
  }, [index, scrollToIndex]);

  const onNext = useCallback(() => {
    scrollToIndex(index + 1);
  }, [index, scrollToIndex]);

  return (
    <div className={cn(styles.carousel, className)} data-reveal>
      <div className={styles.carouselToolbar}>
        <p className={styles.carouselCount} aria-live="polite">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(services.length).padStart(2, "0")}
        </p>
        <div className={styles.carouselArrows} role="group" aria-label="Service carousel">
          <button
            type="button"
            className={styles.carouselArrowBtn}
            aria-label="Previous service"
            onClick={onPrev}
            disabled={index <= 0}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            className={styles.carouselArrowBtn}
            aria-label="Next service"
            onClick={onNext}
            disabled={index >= services.length - 1}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className={styles.carouselTrack}
        tabIndex={0}
        aria-label="Graphic design services"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            onPrev();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            onNext();
          }
        }}
      >
        {services.map((service, i) => {
          const number = String(i + 1).padStart(2, "0");
          return (
            <article
              key={service.slug}
              data-carousel-card
              className={styles.carouselCard}
              aria-label={`${number}. ${service.title}`}
            >
              <div className={styles.carouselMedia}>
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 899px) 85vw, 0px"
                  className={styles.image}
                  priority={i === 0}
                />
              </div>

              <div className={styles.carouselBody}>
                <div className={styles.metaTop}>
                  <span className={styles.index}>{number}</span>
                  <span className={styles.category}>{service.category}</span>
                </div>
                <h3 className={styles.carouselTitle}>{service.title}</h3>
                <p className={styles.carouselDescription}>{service.description}</p>
                <Link href={service.href} className={styles.cta}>
                  Explore
                  <ArrowUpRight
                    aria-hidden
                    className={cn("size-3.5", styles.ctaIcon)}
                  />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.carouselDots} role="tablist" aria-label="Service slides">
        {services.map((service, i) => (
          <button
            key={service.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to ${service.title}`}
            className={cn(
              styles.carouselDot,
              i === index && styles.carouselDotActive,
            )}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
