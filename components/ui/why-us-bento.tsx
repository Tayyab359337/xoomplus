"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  ArrowRight,
  Compass,
  Layers,
  PenTool,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type WhyUsBentoItem = {
  id: string;
  title: string;
  description: string;
};

export type WhyUsBentoProps = {
  className?: string;
  items?: WhyUsBentoItem[];
  teamAvatars?: string[];
  pipelineSteps?: { id: string; label: string; Icon: LucideIcon }[];
};

const DEFAULT_ITEMS: WhyUsBentoItem[] = [
  {
    id: "01",
    title: "Strategic thinking",
    description:
      "Every layout starts with audience, offer, and constraint — so the craft sells, not just looks expensive.",
  },
  {
    id: "02",
    title: "Brief to brand",
    description:
      "From first mark to campaign system — direction, type, and applications held in one visual language.",
  },
  {
    id: "03",
    title: "Creative direction",
    description:
      "Senior designers on the work from kickoff. No rotating benches, no diluted taste.",
  },
  {
    id: "04",
    title: "One team pipeline",
    description:
      "Discover to deliver without handoffs. The people on the first call are the ones shipping files.",
  },
  {
    id: "05",
    title: "Digital-first systems",
    description:
      "UI, social, print, and identity built as one system — consistent wherever the brand shows up.",
  },
];

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1626785774573-4b7993143468?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1634942537034-2531766687a7?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b21e11e55d8?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80",
];

const DEFAULT_PIPELINE: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "01", label: "FIND", Icon: Compass },
  { id: "02", label: "LOCK", Icon: Layers },
  { id: "03", label: "MAKE", Icon: PenTool },
  { id: "04", label: "TUNE", Icon: Sparkles },
  { id: "05", label: "SHIP", Icon: Rocket },
];

const HOVER_EASE = [0.33, 1, 0.68, 1] as const;

function FlipTitle({ text, accentClassName }: { text: string; accentClassName?: string }) {
  return (
    <h3 className="relative mb-1.5 flex flex-wrap overflow-hidden font-display text-lg font-semibold tracking-tight text-foreground sm:mb-2 sm:text-xl md:text-2xl">
      <span className="flex">
        {text.split("").map((letter, i) => (
          <motion.span
            key={`a-${i}`}
            className="inline-block"
            variants={{
              initial: { y: 0 },
              hover: { y: "-100%" },
            }}
            transition={{ duration: 0.3, delay: i * 0.02, ease: HOVER_EASE }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>
      <span
        className={cn(
          "pointer-events-none absolute inset-0 flex text-accent",
          accentClassName,
        )}
        aria-hidden
      >
        {text.split("").map((letter, i) => (
          <motion.span
            key={`b-${i}`}
            className="inline-block"
            variants={{
              initial: { y: "100%" },
              hover: { y: 0 },
            }}
            transition={{ duration: 0.3, delay: i * 0.02, ease: HOVER_EASE }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>
    </h3>
  );
}

function IsoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      aria-hidden
      className={cn("h-auto w-full", className)}
    >
      <path
        d="M100 12L168 52V108L100 148L32 108V52L100 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent/70"
      />
      <path
        d="M100 12V148M32 52L100 92L168 52M32 108L100 68L168 108"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground/25"
      />
      <path
        d="M100 52L140 76V100L100 124L60 100V76L100 52Z"
        fill="currentColor"
        className="text-accent/20"
      />
    </svg>
  );
}

function IsoStack({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 140"
      fill="none"
      aria-hidden
      className={cn("h-auto w-full", className)}
    >
      <g className="text-accent/35" fill="currentColor">
        <path d="M40 88L100 52L160 88L100 124L40 88Z" />
      </g>
      <g className="text-accent/55" fill="currentColor">
        <path d="M70 72L130 36L190 72L130 108L70 72Z" />
      </g>
      <g stroke="currentColor" strokeWidth="1.4" className="text-foreground/40">
        <path d="M90 56L150 20L210 56L150 92L90 56Z" fill="color-mix(in srgb, var(--accent) 18%, transparent)" />
        <path d="M90 56L150 92L210 56M150 20V92" />
      </g>
    </svg>
  );
}

const cellBase =
  "relative flex min-h-[150px] flex-col overflow-hidden rounded-xl border-2 border-border/80 bg-card/40 p-5 transition-colors duration-500 sm:min-h-[170px] sm:p-6 md:p-7";

/**
 * VengeanceUI Why Us Bento — adapted for Xoomplus tokens / motion / lucide.
 * Registry JSON was unavailable upstream; structure preserved from source.
 */
export function WhyUsBento({
  className,
  items = DEFAULT_ITEMS,
  teamAvatars = DEFAULT_AVATARS,
  pipelineSteps = DEFAULT_PIPELINE,
}: WhyUsBentoProps) {
  const [one, two, three, four, five] = items;

  return (
    <div className={cn("relative z-10 w-full", className)}>
      <div className="grid auto-rows-auto grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-3">
        {/* 01 — wide */}
        <motion.div
          initial="initial"
          whileHover="hover"
          className={cn(cellBase, "group justify-center md:col-span-2")}
        >
          <div className="pointer-events-none absolute top-1/2 right-2 z-20 hidden w-36 -translate-y-1/2 text-foreground sm:right-4 sm:block sm:w-48 md:-right-2 md:w-60 lg:right-4 lg:w-72">
            <IsoMark />
          </div>
          <div className="relative z-30 w-full sm:w-3/5">
            <FlipTitle text={one.title} />
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              {one.description}
            </p>
          </div>
          <span className="pointer-events-none absolute -right-3 -bottom-8 select-none font-display text-[6rem] leading-none font-semibold text-foreground/5 transition-transform duration-700 group-hover:scale-105 sm:text-[8rem]">
            {one.id}
          </span>
        </motion.div>

        {/* 02 — tall dark */}
        <div className="group relative col-span-1 row-span-1 flex min-h-[310px] flex-col justify-between overflow-hidden rounded-xl border-2 border-foreground/15 bg-[#060b0e] p-5 text-white transition-all duration-500 sm:min-h-[350px] sm:p-6 md:row-span-2 md:p-7">
          <div className="relative z-10 mb-3 flex min-h-[140px] w-full translate-x-2 flex-col items-center justify-center sm:mb-4 sm:min-h-[160px]">
            <div className="group-hover:scale-105 group-hover:-translate-y-2 relative aspect-[4/3] w-full max-w-[170px] transition-all duration-300 ease-out sm:max-w-[200px]">
              <div className="absolute inset-0 -translate-x-3 translate-y-3 -rotate-12 rounded-xl border border-white/10 bg-[#2a3a40] shadow-xl transition-all duration-300 group-hover:-translate-x-6 group-hover:translate-y-6 group-hover:rotate-[-20deg]" />
              <div className="absolute inset-0 -translate-x-2.5 translate-y-2.5 -rotate-9 rounded-xl border border-white/10 bg-[#3a5058] shadow-xl transition-all duration-300 group-hover:-translate-x-5 group-hover:translate-y-5 group-hover:rotate-[-15deg]" />
              <div className="absolute inset-0 -translate-x-1.5 translate-y-1.5 -rotate-6 rounded-xl border border-white/10 bg-[#4a6a74] shadow-xl transition-all duration-300 group-hover:-translate-x-3 group-hover:translate-y-3 group-hover:rotate-[-10deg]" />
              <div className="absolute inset-0 -translate-x-1 translate-y-1 -rotate-3 rounded-xl border border-white/15 bg-[#6a8f98] shadow-xl transition-all duration-300 group-hover:-translate-x-1.5 group-hover:translate-y-1.5 group-hover:-rotate-5" />
              <div
                className="absolute inset-0 flex flex-col justify-between rounded-xl border border-white/40 bg-[#f4f8f9] p-3.5 text-black shadow-2xl sm:p-4"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(26,46,51,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,46,51,0.05) 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              >
                <div className="flex gap-0.5">
                  <div className="h-3 w-2 rounded-sm bg-[#1a2e33]" />
                  <div className="h-3 w-1 rounded-sm bg-[#478997]" />
                  <div className="h-3 w-2 rounded-sm bg-[#1a2e33]/30" />
                </div>
                <div className="mt-auto mb-2 font-display text-[15px] leading-[1.1] font-semibold tracking-tight sm:text-[18px] md:text-[20px]">
                  Mark.
                  <br />
                  System.
                  <br />
                  Campaign.
                </div>
                <div className="flex items-center gap-1 font-mono text-[7px] font-bold tracking-wider text-[#5a7278] uppercase sm:text-[8px]">
                  <span>&gt; READY TO DESIGN</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="mb-1.5 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
              {two.title}
            </h3>
            <p className="text-xs leading-relaxed text-white/55 sm:text-sm">
              {two.description}
            </p>
          </div>
          <div className="pointer-events-none absolute -right-6 -bottom-12 select-none font-display text-[9rem] leading-none font-semibold text-white/5 transition-transform duration-700 group-hover:scale-105 sm:text-[12rem]">
            {two.id}
          </div>
        </div>

        {/* 03 */}
        <motion.div
          initial="initial"
          whileHover="hover"
          className={cn(cellBase, "group justify-between")}
        >
          <div className="relative z-10 mb-3 flex h-8 items-center sm:h-10">
            {teamAvatars.map((src, i) => (
              <motion.div
                key={`${src}-${i}`}
                className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-[color-mix(in_srgb,var(--background)_80%,transparent)] shadow-sm sm:h-9 sm:w-9"
                style={{
                  marginLeft: i === 0 ? 0 : "-9px",
                  zIndex: teamAvatars.length - i,
                }}
                variants={{
                  initial: { x: 0, y: 0, rotate: 0, scale: 1 },
                  hover: {
                    x: i * 12,
                    y: i % 2 === 0 ? -4 : 4,
                    rotate: (i - 2) * 5,
                    scale: 1.1,
                  },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover object-center"
                />
              </motion.div>
            ))}
          </div>
          <div className="relative z-10">
            <h3 className="mb-1.5 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {three.title}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {three.description}
            </p>
          </div>
          <div className="pointer-events-none absolute -right-3 -bottom-8 select-none font-display text-[6rem] leading-none font-semibold text-foreground/5 transition-transform duration-700 group-hover:scale-105 sm:text-[8rem]">
            {three.id}
          </div>
        </motion.div>

        {/* 04 */}
        <motion.div
          initial="initial"
          whileHover="hover"
          className={cn(cellBase, "group justify-between")}
        >
          <div className="relative z-10 mb-3 w-full">
            <div className="flex items-start justify-between">
              {pipelineSteps.map(({ id, label, Icon }, i) => (
                <React.Fragment key={id}>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="relative">
                      <Icon
                        className="size-[18px] text-foreground sm:size-5"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      {i === pipelineSteps.length - 1 ? (
                        <span className="absolute -inset-1 animate-ping rounded-full bg-accent/25" />
                      ) : null}
                    </div>
                    <span className="font-mono text-[6.5px] font-bold tracking-widest text-foreground/80 sm:text-[7.5px]">
                      {label}
                    </span>
                  </div>
                  {i < pipelineSteps.length - 1 ? (
                    <div className="mt-0.5 text-foreground/25 transition-colors duration-300 group-hover:text-accent">
                      <ArrowRight className="size-2.5" aria-hidden />
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="mb-1.5 font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {four.title}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {four.description}
            </p>
          </div>
          <div className="pointer-events-none absolute -right-3 -bottom-8 select-none font-display text-[6rem] leading-none font-semibold text-foreground/5 transition-transform duration-700 group-hover:scale-105 sm:text-[8rem]">
            {four.id}
          </div>
        </motion.div>

        {/* 05 — wide bottom */}
        <motion.div
          initial="initial"
          whileHover="hover"
          className={cn(cellBase, "group justify-center md:col-span-3")}
        >
          <div className="pointer-events-none absolute right-2 bottom-0 z-20 hidden w-36 text-foreground sm:right-4 sm:block sm:w-56 md:right-8 md:w-72 lg:right-16 lg:w-80">
            <IsoStack />
          </div>
          <div className="relative z-30 w-full sm:w-3/5">
            <h3 className="mb-1.5 font-display text-lg font-semibold tracking-tight text-foreground sm:mb-2 sm:text-xl md:text-2xl">
              {five.title}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm md:max-w-xl md:text-base">
              {five.description}
            </p>
          </div>
          <div className="pointer-events-none absolute -right-6 -bottom-12 z-10 select-none font-display text-[8rem] leading-none font-semibold text-foreground/5 transition-transform duration-700 group-hover:scale-105 sm:text-[11rem]">
            {five.id}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WhyUsBento;
