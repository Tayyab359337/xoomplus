import {
  gsap,
  prefersReducedMotion,
  registerGsapPlugins,
} from "./gsap";
import { EASE_OUT_EXPO, EASE_OUT_SOFT } from "./presets";

export type PreloaderElements = {
  root: HTMLElement;
  mark: HTMLElement;
  tagline?: HTMLElement | null;
  progressFill: HTMLElement;
  progressLabel: HTMLElement;
};

/**
 * Build the intro timeline.
 * Progress is driven externally — no fake long delay.
 */
export function createPreloaderTimeline(els: PreloaderElements) {
  registerGsapPlugins();

  const { root, mark, tagline, progressFill, progressLabel } = els;

  gsap.set(root, { autoAlpha: 1 });
  gsap.set(mark, { autoAlpha: 0, y: 16 });
  if (tagline) gsap.set(tagline, { autoAlpha: 0, y: 10 });
  gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(progressLabel, { autoAlpha: 0 });

  const intro = gsap.timeline();
  intro
    .to(mark, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: EASE_OUT_EXPO,
    })
    .to(
      progressLabel,
      { autoAlpha: 1, duration: 0.35, ease: EASE_OUT_SOFT },
      "-=0.25",
    );

  if (tagline) {
    intro.to(
      tagline,
      { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE_OUT_SOFT },
      "-=0.35",
    );
  }

  return intro;
}

export function animatePreloaderProgress(
  fill: HTMLElement,
  label: HTMLElement,
  progress: number,
) {
  const p = Math.max(0, Math.min(1, progress));
  gsap.to(fill, {
    scaleX: p,
    duration: 0.35,
    ease: EASE_OUT_SOFT,
    overwrite: "auto",
  });
  label.textContent = String(Math.round(p * 100)).padStart(3, "0");
}

/** Exit sequence — clip/transform only. ~400–600ms. */
export function playPreloaderExit(els: PreloaderElements): Promise<void> {
  registerGsapPlugins();

  const { root, mark, tagline, progressFill, progressLabel } = els;

  if (prefersReducedMotion()) {
    gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { pointerEvents: "none", display: "none" });
        resolve();
      },
    });

    tl.to([mark, tagline, progressLabel, progressFill].filter(Boolean), {
      autoAlpha: 0,
      y: -12,
      duration: 0.35,
      ease: EASE_OUT_SOFT,
      stagger: 0.03,
    }).to(
      root,
      {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.55,
        ease: EASE_OUT_EXPO,
      },
      "-=0.1",
    );
  });
}

/** Soft floor so the preloader feels intentional without blocking fast loads. */
export const PRELOADER_MIN_MS = 650;
export const PRELOADER_MAX_MS = 1200;
