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

import type { PortfolioProject } from "@/lib/data/portfolio";
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

const toneClass: Record<PortfolioProject["tone"], string> = {
  ember: "bg-[oklch(0.42_0.12_35)] text-white",
  ink: "bg-[oklch(0.22_0.02_250)] text-white",
  sand: "bg-[oklch(0.86_0.03_85)] text-[oklch(0.2_0.02_250)]",
  steel: "bg-[oklch(0.38_0.03_250)] text-white",
  olive: "bg-[oklch(0.42_0.06_130)] text-white",
};

/**
 * Aceternity Interface Crafts Cards — fan layout with scale / offset animation.
 * Adapted to accept portfolio project data (image, category, tech, CTA).
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
                initial={{ x: 0, scale: 0 }}
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
                }}
                whileHover={{
                  scale: isCurrent ? activeScale : muted ? 0.7 : 1.05,
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
                  "absolute top-1/2 left-1/2 flex cursor-pointer flex-col overflow-hidden rounded-sm border border-border/40 p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-3",
                  toneClass[card.tone],
                )}
              >
                <div className="relative h-[42%] w-full shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 230px, 300px"
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>

                <div className="mt-3 flex min-h-0 flex-1 flex-col">
                  <p className="type-meta mb-1.5 opacity-70">{card.category}</p>
                  <motion.h3
                    layoutId={`${card.id}-title`}
                    className="font-display max-w-[12ch] text-left text-lg leading-[1.05] tracking-tight md:text-2xl"
                  >
                    {card.title}
                  </motion.h3>

                  <AnimatePresence mode="popLayout">
                    {isCurrent ? (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={spring}
                        className="mt-2 flex min-h-0 flex-1 flex-col"
                      >
                        <p className="line-clamp-3 text-left text-xs leading-relaxed opacity-85 md:text-sm">
                          {card.summary}
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-1">
                          {card.technologies.map((tech) => (
                            <li
                              key={tech}
                              className="rounded-sm border border-current/25 px-1.5 py-0.5 text-[0.65rem] tracking-wide uppercase opacity-80"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={card.href}
                          onClick={(e) => e.stopPropagation()}
                          className="type-button mt-auto inline-flex items-center gap-1.5 self-start pt-3 underline-offset-4 hover:underline"
                        >
                          {card.ctaLabel}
                          <ArrowUpRight className="size-3.5" aria-hidden />
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
