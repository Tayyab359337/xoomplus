"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { PortfolioProject } from "@/lib/data/portfolio";
import {
  attachImageHover,
  attachVelocityThrow,
  destroyCursorPreview,
  ensureCursorPreview,
  featureEnabled,
  hideCursorPreview,
  moveCursorPreview,
  resolveMotionTier,
  showCursorPreview,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

type SpringConfig = {
  type: "spring";
  bounce?: number;
  visualDuration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export interface InterfaceCraftsCardsProps {
  items: PortfolioProject[];
  spring?: SpringConfig;
  activeScale?: number;
  cardSpacing?: number;
  className?: string;
}

const defaultSpring: SpringConfig = {
  type: "spring",
  visualDuration: 0.6,
  bounce: 0.25,
};

export const controls = {
  spring: defaultSpring,
  activeScale: [1.15, 1, 1.6, 0.01] as const,
  cardSpacing: [180, 40, 320, 5] as const,
};

/** Unified dark media-card surface — tones only tint the wash, not the shell. */
const toneWash: Record<PortfolioProject["tone"], string> = {
  ember: "from-[oklch(0.42_0.08_200)]/35",
  ink: "from-[oklch(0.28_0.04_220)]/40",
  sand: "from-[oklch(0.55_0.05_200)]/30",
  steel: "from-[oklch(0.38_0.04_220)]/35",
  olive: "from-[oklch(0.42_0.05_190)]/35",
};

/**
 * Aceternity Interface Crafts Cards — fan layout (Motion) + GSAP media polish.
 * Cursor preview / velocity throw are desktop enhancements only.
 */
export function InterfaceCraftsCards({
  items,
  spring = defaultSpring,
  activeScale = 1.15,
  cardSpacing = 180,
  className,
}: InterfaceCraftsCardsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [spacing, setSpacing] = useState(cardSpacing);
  const ref = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActiveId(null);
      }
    };

    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () =>
      setSpacing(mq.matches ? cardSpacing : Math.round(cardSpacing * 0.39));
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [cardSpacing]);

  // Shared cursor preview + image hover / one velocity throw
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || reduceMotion) return;

      const tier = resolveMotionTier({
        reducedMotion: reduceMotion,
        width: window.innerWidth,
      });

      const cleanups: Array<() => void> = [];
      const cards = root.querySelectorAll<HTMLElement>("[data-portfolio-card]");

      if (featureEnabled("cursorPreview", tier)) {
        const preview = ensureCursorPreview();

        cards.forEach((card) => {
          const src = card.dataset.previewSrc;
          if (!src) return;

          const onEnter = (event: PointerEvent) => {
            showCursorPreview(preview, src, event);
          };
          const onMove = (event: PointerEvent) => {
            moveCursorPreview(preview, event);
          };
          const onLeave = () => {
            hideCursorPreview(preview);
          };

          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });

        cleanups.push(() => {
          hideCursorPreview(preview);
        });
      }

      if (featureEnabled("imageHover", tier)) {
        cards.forEach((card, index) => {
          const mediaWrap = card.querySelector<HTMLElement>(
            "[data-portfolio-media]",
          );
          const media = mediaWrap?.querySelector<HTMLElement>("img");
          if (!mediaWrap || !media) return;

          // First project: special velocity throw; others: physical hover
          if (index === 0 && featureEnabled("velocityThrow", tier)) {
            cleanups.push(attachVelocityThrow(mediaWrap, media));
          } else {
            cleanups.push(
              attachImageHover(mediaWrap, media, {
                scale: 1.07,
                rotate: 0.5,
                y: -5,
              }),
            );
          }
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
        destroyCursorPreview();
      };
    },
    { dependencies: [reduceMotion, items] },
  );

  const middle = (items.length - 1) / 2;
  const anyActive = Boolean(activeId);

  const onCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    id: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveId((prev) => (prev === id ? null : id));
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      role="list"
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        Portfolio projects
      </span>
      <motion.div
        ref={ref}
        onClick={() => setActiveId(null)}
        className="relative mx-auto flex h-[28rem] w-full max-w-5xl items-center justify-center [--height:320px] [--width:230px] sm:h-[32rem] lg:h-[36rem] lg:[--height:440px] lg:[--width:300px]"
      >
        {items.map((card, index) => {
          const offsetX = (index - middle) * spacing;
          const isCurrent = activeId === card.id;
          const muted = anyActive && !isCurrent;

          return (
            <motion.div key={card.id} role="listitem">
              <motion.div
                role="button"
                tabIndex={0}
                aria-expanded={isCurrent}
                aria-label={`${card.title}, ${card.category}`}
                data-portfolio-card
                data-preview-src={card.image || undefined}
                initial={{ x: 0, scale: 0.96, opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveId(isCurrent ? null : card.id);
                }}
                onKeyDown={(e) => onCardKeyDown(e, card.id)}
                animate={{
                  y: isCurrent ? 0 : muted ? 380 : card.config.y,
                  x: isCurrent ? 0 : muted ? offsetX * 0.4 : offsetX,
                  rotate: isCurrent
                    ? 0
                    : muted
                      ? 0.2 * card.config.rotate
                      : card.config.rotate,
                  scale: isCurrent ? activeScale : muted ? 0.7 : 1,
                  opacity: 1,
                }}
                whileHover={{
                  scale: isCurrent ? activeScale : muted ? 0.7 : 1.04,
                }}
                transition={spring}
                style={{
                  width: "var(--width)",
                  height: "var(--height)",
                  marginLeft: "calc(var(--width) / -2)",
                  marginTop: "calc(var(--height) / -2)",
                  zIndex: isCurrent ? 50 : card.config.zIndex,
                }}
                className={cn(
                  "absolute top-1/2 left-1/2 flex cursor-pointer flex-col gap-3 overflow-hidden rounded-3xl border border-border/50 bg-card p-3 text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:gap-4 md:p-4",
                  "shadow-[0_12px_40px_color-mix(in_srgb,var(--foreground)_5%,transparent)]",
                )}
              >
                <div
                  data-portfolio-media
                  className="relative h-[46%] w-full shrink-0 overflow-hidden rounded-2xl bg-muted"
                >
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.imageAlt || card.title}
                      fill
                      sizes="(max-width: 1024px) 210px, 220px"
                      className="object-cover"
                      quality={70}
                      loading="lazy"
                    />
                  ) : null}
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-300",
                      toneWash[card.tone],
                      isCurrent ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-1 px-0.5">
                  <motion.h3
                    layoutId={`${card.id}-title`}
                    className="font-display max-w-[14ch] text-left text-lg leading-[1.15] font-semibold tracking-tight md:text-xl"
                  >
                    {card.title}
                  </motion.h3>
                  <p className="line-clamp-2 text-left text-sm leading-relaxed text-muted-foreground">
                    {isCurrent ? card.summary : card.category}
                  </p>

                  <AnimatePresence mode="popLayout">
                    {isCurrent ? (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={spring}
                        className="mt-1 flex min-h-0 flex-1 flex-col"
                      >
                        <ul className="mt-1 flex flex-wrap gap-1">
                          {card.technologies.map((tech) => (
                            <li
                              key={tech}
                              className="rounded-md border border-border/60 px-1.5 py-0.5 text-[0.65rem] tracking-wide text-muted-foreground uppercase"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={card.href}
                          onClick={(e) => e.stopPropagation()}
                          className="type-button mt-auto inline-flex items-center gap-1.5 self-start pt-3 text-foreground underline-offset-4 hover:underline"
                        >
                          {card.ctaLabel}
                          <ArrowUpRight
                            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden
                          />
                        </Link>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default InterfaceCraftsCards;
