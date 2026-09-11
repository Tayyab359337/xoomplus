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

export type PreloaderController = {
  timeline: gsap.core.Timeline;
  setProgress: (progress: number) => void;
  /** Zoom-through exit; always resolves (even if interrupted) */
  playExit: () => Promise<void>;
  kill: () => void;
};

/**
 * Entry on a master timeline; exit on a dedicated timeline so completion
 * is reliable after the entry playhead has already finished.
 */
export function createPreloaderController(
  els: PreloaderElements,
): PreloaderController {
  registerGsapPlugins();

  const { root, mark, tagline, progressFill, progressLabel } = els;
  const chrome = [tagline, progressLabel, progressFill.parentElement].filter(
    Boolean,
  ) as HTMLElement[];

  let killed = false;
  let exitTl: gsap.core.Timeline | null = null;

  gsap.set(root, {
    autoAlpha: 1,
    scale: 1,
    transformOrigin: "50% 50%",
  });
  gsap.set(mark, {
    autoAlpha: 0,
    scale: 0.86,
    transformOrigin: "50% 45%",
  });
  if (tagline) gsap.set(tagline, { autoAlpha: 0, y: 10 });
  gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(progressLabel, { autoAlpha: 0, scale: 0.92 });

  const timeline = gsap.timeline();

  timeline
    .to(mark, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.65,
      ease: EASE_OUT_EXPO,
    })
    .to(
      progressLabel,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: EASE_OUT_SOFT,
      },
      "-=0.3",
    );

  if (tagline) {
    timeline.to(
      tagline,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: EASE_OUT_SOFT,
      },
      "-=0.35",
    );
  }

  const fillTween = gsap.to(progressFill, {
    scaleX: 0,
    duration: 0.38,
    ease: EASE_OUT_SOFT,
    paused: true,
  });

  const counter = { n: 0 };
  const counterTween = gsap.to(counter, {
    n: 0,
    duration: 0.5,
    ease: "back.out(1.6)",
    paused: true,
    onUpdate: () => {
      progressLabel.textContent = String(Math.round(counter.n)).padStart(3, "0");
    },
  });

  const setProgress = (progress: number) => {
    if (killed) return;
    const p = Math.max(0, Math.min(1, progress));
    fillTween.vars.scaleX = p;
    fillTween.invalidate().restart();
    counterTween.vars.n = Math.round(p * 100);
    counterTween.invalidate().restart();
  };

  const finishHide = () => {
    gsap.set(root, { autoAlpha: 0, pointerEvents: "none", display: "none" });
  };

  const playExit = (): Promise<void> => {
    if (killed) {
      finishHide();
      return Promise.resolve();
    }

    if (prefersReducedMotion()) {
      finishHide();
      return Promise.resolve();
    }

    fillTween.kill();
    counterTween.kill();

    return new Promise((resolve) => {
      if (killed) {
        finishHide();
        resolve();
        return;
      }

      const hero = document.querySelector<HTMLElement>("[data-hero]");
      // Cap zoom: no vector logo in repo — large CSS transform rasterizes/blurs text.
      // Mobile needs a smaller factor so the mark doesn't clip on ~375px viewports.
      const isNarrow = window.matchMedia("(max-width: 767px)").matches;
      const isTablet = window.matchMedia("(max-width: 1023px)").matches;
      const markZoom = isNarrow ? 2.6 : isTablet ? 2.85 : 3;

      if (hero) {
        gsap.set(hero, {
          scale: isNarrow ? 1.04 : 1.08,
          transformOrigin: "50% 45%",
        });
      }

      exitTl = gsap.timeline({
        onComplete: () => {
          finishHide();
          resolve();
        },
      });

      exitTl
        .to(chrome, {
          autoAlpha: 0,
          scale: 0.94,
          duration: 0.28,
          ease: EASE_OUT_SOFT,
          stagger: 0.02,
        })
        .to(
          mark,
          {
            scale: markZoom,
            duration: 0.9,
            ease: "expo.inOut",
            transformOrigin: "50% 45%",
          },
          "-=0.1",
        )
        .to(
          mark,
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: "power2.in",
          },
          "-=0.35",
        )
        .to(
          root,
          {
            autoAlpha: 0,
            scale: 1.08,
            duration: 0.5,
            ease: "power4.in",
            transformOrigin: "50% 50%",
          },
          "-=0.45",
        );

      if (hero) {
        exitTl.to(
          hero,
          {
            scale: 1,
            duration: 0.95,
            ease: EASE_OUT_EXPO,
            clearProps: "transform",
          },
          "<",
        );
      }
    });
  };

  const kill = () => {
    killed = true;
    fillTween.kill();
    counterTween.kill();
    timeline.kill();
    exitTl?.kill();
    exitTl = null;
  };

  return { timeline, setProgress, playExit, kill };
}

/** Soft floor so the preloader feels intentional without blocking fast loads. */
export const PRELOADER_MIN_MS = 650;
export const PRELOADER_MAX_MS = 1200;

/* -------------------------------------------------------------------------- */
/* Legacy aliases — kept so any stray imports still typecheck during migrate  */
/* -------------------------------------------------------------------------- */

/** @deprecated use createPreloaderController */
export function createPreloaderTimeline(els: PreloaderElements) {
  return createPreloaderController(els).timeline;
}

/** @deprecated use controller.setProgress */
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

/** @deprecated use controller.playExit */
export function playPreloaderExit(els: PreloaderElements): Promise<void> {
  return createPreloaderController(els).playExit();
}
