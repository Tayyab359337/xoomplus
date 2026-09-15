"use client";

import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { useCallback, useRef } from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { gsap, refreshScrollTrigger, registerGsapPlugins, ScrollTrigger } from "@/lib/animations";
import {
  seoProcessCopy,
  seoProcessSteps,
  type SeoProcessStep,
} from "@/lib/data/seo-process";
import { cn } from "@/lib/utils";

import { SeoProcessVisual } from "./seo-process-visual";
import styles from "./seo-process.module.css";

const STEP_COUNT = seoProcessSteps.length;
const LAST_INDEX = STEP_COUNT - 1;
const PIN_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type SeoProcessProps = {
  className?: string;
  steps?: SeoProcessStep[];
};

type ScrollTriggerLike = {
  start: number;
  end: number;
};

/**
 * SEO “Our Process” — self-contained horizontal journey on desktop,
 * native vertical stack on touch / compact viewports.
 */
export function SeoProcess({
  className,
  steps = seoProcessSteps,
}: SeoProcessProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const triggerRef = useRef<ScrollTriggerLike | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useSectionReveal(sectionRef);

  const applyProgress = useCallback((progress: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const clamped = Math.max(0, Math.min(1, progress));
    const index = Math.round(clamped * LAST_INDEX);
    const label = String(index + 1).padStart(2, "0");

    const count = section.querySelector<HTMLElement>("[data-process-count]");
    const fill = section.querySelector<HTMLElement>("[data-process-fill]");
    const bar = section.querySelector<HTMLElement>("[data-process-bar]");

    if (count) count.textContent = label;
    if (fill) fill.style.transform = `scaleX(${clamped})`;
    if (bar) bar.setAttribute("aria-valuenow", String(index + 1));

    const cards = section.querySelectorAll<HTMLElement>("[data-process-card]");
    cards.forEach((card, i) => {
      const on = i === index;
      if (on) {
        card.setAttribute("data-active", "true");
        card.setAttribute("aria-current", "step");
      } else {
        card.removeAttribute("data-active");
        card.removeAttribute("aria-current");
      }
    });

    const dots = section.querySelectorAll<HTMLElement>("[data-process-dot]");
    dots.forEach((dot, i) => {
      const on = i === index;
      if (on) {
        dot.setAttribute("data-active", "true");
        dot.setAttribute("aria-current", "step");
      } else {
        dot.removeAttribute("data-active");
        dot.removeAttribute("aria-current");
      }
    });

    const beams = section.querySelectorAll<HTMLElement>("[data-process-beam]");
    beams.forEach((beam, i) => {
      const amount = Math.max(0, Math.min(1, clamped * LAST_INDEX - i));
      beam.style.setProperty("--beam-progress", amount.toFixed(3));
      if (amount > 0.12) beam.setAttribute("data-lit", "true");
      else beam.removeAttribute("data-lit");
    });
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track) return;

      registerGsapPlugins();
      applyProgress(0);

      const inview = new IntersectionObserver(
        ([entry]) => {
          section.toggleAttribute("data-inview", Boolean(entry?.isIntersecting));
        },
        { threshold: 0.12 },
      );
      inview.observe(section);

      const mm = gsap.matchMedia();

      mm.add(PIN_QUERY, () => {
        const pinTarget =
          section.querySelector<HTMLElement>("[data-process-pin]") ?? section;

        const getTravel = () => {
          // Layout sizes ignore the current x transform, so refresh stays stable.
          // Travel ends when the last card’s right edge sits on the viewport’s right.
          return Math.max(0, track.scrollWidth - viewport.clientWidth);
        };

        const pinTop =
          getComputedStyle(pinTarget)
            .getPropertyValue("--seo-process-pin-top")
            .trim() || "88px";

        const snapPinBleed = () => {
          if (window.getComputedStyle(pinTarget).position !== "fixed") return;
          const rect = section.getBoundingClientRect();
          pinTarget.style.left = `${Math.round(rect.left)}px`;
          pinTarget.style.right = "auto";
          pinTarget.style.top = pinTop;
          pinTarget.style.width = `${Math.round(rect.width)}px`;
          pinTarget.style.maxWidth = "none";
          pinTarget.style.margin = "0";
        };

        // Pin as soon as the section reaches the sticky offset so the
        // horizontal cards are already fully composed (above the page blur).
        const tween = gsap.to(track, {
          x: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: `top ${pinTop}`,
            end: () => `+=${Math.max(getTravel(), 1)}`,
            pin: pinTarget,
            pinSpacing: true,
            pinType: "fixed",
            scrub: true,
            anticipatePin: 0,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              applyProgress(self.progress);
            },
            onRefresh: snapPinBleed,
            onToggle: (self) => {
              track.style.willChange = self.isActive ? "transform" : "auto";
              snapPinBleed();
            },
          },
        });

        triggerRef.current = tween.scrollTrigger ?? null;

        const refresh = () => refreshScrollTrigger();
        requestAnimationFrame(refresh);
        window.addEventListener("load", refresh, { once: true });

        return () => {
          window.removeEventListener("load", refresh);
          triggerRef.current = null;
          track.style.willChange = "auto";
          gsap.set(track, { x: 0 });
        };
      });

      mm.add(
        "(max-width: 1023px), (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)",
        () => {
          const cards = Array.from(
            section.querySelectorAll<HTMLElement>("[data-process-card]"),
          );
          if (!cards.length) return;

          const pick = () => {
            let best = 0;
            let bestVisible = -1;
            const vh = window.innerHeight;
            cards.forEach((card, i) => {
              const rect = card.getBoundingClientRect();
              const visible =
                Math.min(rect.bottom, vh * 0.82) - Math.max(rect.top, vh * 0.18);
              if (visible > bestVisible) {
                bestVisible = visible;
                best = i;
              }
            });
            applyProgress(best / LAST_INDEX);
          };

          const io = new IntersectionObserver(pick, {
            threshold: [0.25, 0.5, 0.75],
            rootMargin: "-12% 0px -18% 0px",
          });
          cards.forEach((card) => io.observe(card));
          pick();

          return () => io.disconnect();
        },
      );

      const onDotActivate = (index: number) => {
        const trigger = triggerRef.current;
        const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
        if (trigger) {
          const y =
            trigger.start +
            ((trigger.end - trigger.start) * index) / LAST_INDEX;
          window.scrollTo({ top: y, behavior });
          return;
        }
        const card = section.querySelectorAll<HTMLElement>("[data-process-card]")[
          index
        ];
        card?.scrollIntoView({ behavior, block: "center" });
      };

      const dots = Array.from(
        section.querySelectorAll<HTMLButtonElement>("[data-process-dot]"),
      );
      const onClick = (event: Event) => {
        const button = event.currentTarget as HTMLButtonElement;
        const index = Number(button.dataset.processDot);
        if (Number.isFinite(index)) onDotActivate(index);
      };
      dots.forEach((dot) => dot.addEventListener("click", onClick));

      return () => {
        dots.forEach((dot) => dot.removeEventListener("click", onClick));
        inview.disconnect();
        mm.revert();
        triggerRef.current = null;
      };
    },
    {
      scope: sectionRef,
      dependencies: [applyProgress, reduceMotion, steps.length],
    },
  );

  return (
    <section
      ref={sectionRef}
      id="seo-process"
      aria-labelledby="seo-process-heading"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div data-process-pin className={styles.pinFrame}>
        <div className={styles.shell}>
          <header data-reveal className={styles.intro}>
            <SectionEyebrow className={styles.eyebrow}>
              {seoProcessCopy.eyebrow}
            </SectionEyebrow>
            <h2 id="seo-process-heading" className={styles.title}>
              {seoProcessCopy.title}
            </h2>
            <p className={styles.body}>{seoProcessCopy.body}</p>
          </header>

          <SeoProcessProgress />

          <div ref={viewportRef} className={styles.viewport}>
            <ol
              ref={trackRef}
              className={styles.track}
              aria-label="SEO process steps"
            >
              {steps.map((step, index) => (
                <li key={step.number} className={styles.step}>
                  <SeoProcessCard step={step} active={index === 0} />
                  {index < steps.length - 1 ? <SeoProcessBeam /> : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function SeoProcessProgress() {
  return (
    <div className={styles.progress} data-reveal>
      <p className={styles.count} aria-live="polite">
        <span className="sr-only">Current step</span>
        <span data-process-count>01</span>
        <span className={styles.countSep} aria-hidden>
          /
        </span>
        <span className={styles.countTotal}>
          {String(STEP_COUNT).padStart(2, "0")}
        </span>
      </p>
      <div
        data-process-bar
        className={styles.progressTrack}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
        aria-valuenow={1}
        aria-label="Process progress"
      >
        <span data-process-fill className={styles.progressFill} />
      </div>
      <div className={styles.dots} role="group" aria-label="Jump to process step">
        {seoProcessSteps.map((step, index) => (
          <button
            key={step.number}
            type="button"
            data-process-dot={index}
            data-active={index === 0 ? "true" : undefined}
            aria-current={index === 0 ? "step" : undefined}
            aria-label={`Go to step ${step.number}: ${step.title}`}
            className={styles.dot}
          >
            <span>{step.number}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SeoProcessCard({
  step,
  active,
}: {
  step: SeoProcessStep;
  active: boolean;
}) {
  return (
    <article
      data-process-card
      data-active={active ? "true" : undefined}
      aria-current={active ? "step" : undefined}
      className={styles.card}
    >
      <div className={styles.cardTop}>
        <span className={styles.cardNum}>{step.number}</span>
        <span className={styles.cardPhase}>
          {step.phase}
          <span className={styles.cardArrow} aria-hidden>
            <ArrowRight className="size-3" />
          </span>
        </span>
      </div>
      <div className={styles.visualWrap}>
        <SeoProcessVisual variant={step.visual} />
      </div>
      <h3 className={styles.cardTitle}>{step.title}</h3>
      <p className={styles.cardBody}>{step.description}</p>
    </article>
  );
}

function SeoProcessBeam() {
  return (
    <div data-process-beam className={styles.beam} aria-hidden>
      <span className={styles.beamLine}>
        <span className={styles.beamFill} />
        <span className={styles.beamPulse} />
      </span>
      <svg
        className={styles.beamHead}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M2 2 L10 6 L2 10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
