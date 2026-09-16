"use client";

import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export interface SlideData {
  title: string;
  description?: string;
  category?: string;
  button?: string;
  href?: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  totalSlides: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({
  slide,
  index,
  current,
  totalSlides,
  handleSlideClick,
}: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>(0);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [reduceMotion]);

  const handleMouseMove = (event: ReactMouseEvent) => {
    if (reduceMotion) return;
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const { src, button, title, description, category, href } = slide;
  const isCurrent = current === index;
  const slideNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${totalSlides}: ${title}`}
        aria-current={isCurrent ? "true" : undefined}
        tabIndex={0}
        className={cn(
          "relative z-10 flex flex-col justify-between overflow-hidden rounded-2xl text-left text-white select-none transition-all duration-500 ease-out",
          "w-[85vw] max-w-[380px] sm:max-w-[420px] md:w-[440px] h-[480px] sm:h-[520px] mx-3 sm:mx-4",
          "border border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          isCurrent
            ? "shadow-2xl shadow-black/40 ring-1 ring-accent/40"
            : "cursor-pointer opacity-70 hover:opacity-90",
        )}
        onClick={() => handleSlideClick(index)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSlideClick(index);
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: reduceMotion
            ? "none"
            : isCurrent
              ? "scale(1) rotateX(0deg)"
              : "scale(0.94) rotateX(4deg)",
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
          transformOrigin: "bottom center",
        }}
      >
        {/* Background visual shell */}
        <div
          className="absolute inset-0 bg-[#060b0e] overflow-hidden transition-transform duration-150 ease-out"
          style={{
            transform:
              !reduceMotion && isCurrent
                ? "translate3d(calc(var(--x, 0px) / 28), calc(var(--y, 0px) / 28), 0)"
                : "none",
          }}
        >
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 768px) 85vw, 440px"
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              isCurrent ? "scale-105 opacity-85" : "scale-100 opacity-45 grayscale-[30%]",
            )}
            priority={index === 0}
          />
          {/* Multi-stage gradient veil for high text legibility */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#04070a] via-[#04070a]/75 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Card Header (index + category chip) */}
        <div className="relative z-20 flex items-center justify-between p-6">
          <span className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
            {slideNumber}
          </span>
          {category ? (
            <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 font-sans text-xs font-medium text-white/90 backdrop-blur-md">
              {category}
            </span>
          ) : null}
        </div>

        {/* Card Bottom Content */}
        <article
          className={cn(
            "relative z-20 flex flex-col gap-3 p-6 sm:p-7 transition-all duration-500",
            isCurrent ? "translate-y-0 opacity-100" : "translate-y-2 opacity-80",
          )}
        >
          <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            {title}
          </h3>

          {description ? (
            <p className="font-sans text-xs sm:text-sm leading-relaxed text-white/80 line-clamp-3 sm:line-clamp-4">
              {description}
            </p>
          ) : null}

          {href ? (
            <div className="pt-2">
              <Link
                href={href}
                className={cn(
                  "btn-primary text-sm inline-flex items-center gap-2",
                  !isCurrent && "pointer-events-none opacity-0",
                )}
                tabIndex={isCurrent ? 0 : -1}
                onClick={(e) => e.stopPropagation()}
              >
                <span>{button || "Explore Service"}</span>
                <span aria-hidden className="translate-y-px text-[0.95em]">
                  →
                </span>
              </Link>
            </div>
          ) : null}
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  direction: "previous" | "next";
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  direction,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      type="button"
      className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-md transition-all duration-200 hover:border-accent hover:bg-hover hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
      aria-label={title}
      title={title}
      onClick={handleClick}
    >
      {direction === "previous" ? (
        <IconArrowNarrowLeft className="size-5" />
      ) : (
        <IconArrowNarrowRight className="size-5" />
      )}
    </button>
  );
};

export interface CarouselProps {
  slides: SlideData[];
  className?: string;
  ariaLabel?: string;
}

/**
 * Aceternity Carousel adapted for Xoomplus:
 * - Keyboard navigation (Left / Right arrows, Home, End)
 * - Touch swipe on mobile
 * - Accessible landmarks & ARIA labels
 * - Brand styling & responsive layout without horizontal scrollbar overflow
 */
export default function Carousel({
  slides,
  className,
  ariaLabel = "Web Solutions Sub-Services",
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const id = useId();

  const handlePreviousClick = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNextClick = useCallback(() => {
    setCurrent((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const handleSlideClick = useCallback(
    (index: number) => {
      if (current !== index) {
        setCurrent(index);
      }
    },
    [current],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePreviousClick();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNextClick();
      } else if (event.key === "Home") {
        event.preventDefault();
        setCurrent(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setCurrent(slides.length - 1);
      }
    },
    [handlePreviousClick, handleNextClick, slides.length],
  );

  const handleTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: ReactTouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextClick();
      } else {
        handlePreviousClick();
      }
    }
  };

  if (!slides.length) return null;

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "relative w-full overflow-hidden py-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
        className,
      )}
    >
      <div
        className="relative mx-auto flex w-full justify-center overflow-hidden"
        aria-labelledby={`carousel-heading-${id}`}
      >
        <ul
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(calc(50% - ${(current + 0.5) * (100 / slides.length)}%))`,
            width: `${slides.length * 100}%`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.href ?? index}
              className="flex justify-center"
              style={{ width: `${100 / slides.length}%` }}
            >
              <Slide
                slide={slide}
                index={index}
                current={current}
                totalSlides={slides.length}
                handleSlideClick={handleSlideClick}
              />
            </div>
          ))}
        </ul>
      </div>

      {/* Navigation Controls and Counter */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <CarouselControl
          direction="previous"
          title="Previous slide"
          handleClick={handlePreviousClick}
        />

        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-muted-foreground">
          <span className="text-foreground">{String(current + 1).padStart(2, "0")}</span>
          <span>/</span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>

        <CarouselControl
          direction="next"
          title="Next slide"
          handleClick={handleNextClick}
        />
      </div>
    </section>
  );
}
