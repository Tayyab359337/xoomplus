import {
  featureEnabled,
  motionConfig,
  resolveMotionTier,
} from "./config";
import {
  gsap,
  prefersReducedMotion,
  registerGsapPlugins,
  ScrollTrigger,
} from "./gsap";
import {
  getFromVars,
  getToVars,
  type AnimateKind,
} from "./presets";

/** Support both legacy data-animate and data-motion */
export const ANIMATE_SELECTOR = "[data-animate], [data-motion]";
export const PARALLAX_SELECTOR = "[data-parallax], [data-motion='parallax']";

export function refreshScrollTrigger() {
  registerGsapPlugins();
  ScrollTrigger.refresh();
}

export function killAllScrollTriggers() {
  registerGsapPlugins();
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

function readKind(el: HTMLElement): string {
  return el.dataset.motion ?? el.dataset.animate ?? "fade-up";
}

function parseKind(raw: string | null): AnimateKind {
  const value = (raw ?? "fade-up") as AnimateKind;
  const allowed: AnimateKind[] = [
    "fade",
    "fade-up",
    "fade-down",
    "fade-left",
    "fade-right",
    "scale",
    "stagger",
    "image-reveal",
    "clip",
    "parallax",
  ];
  return allowed.includes(value) ? value : "fade-up";
}

function revealElement(el: HTMLElement, kind: AnimateKind) {
  if (kind === "parallax") {
    attachParallax(el);
    return;
  }

  const delay =
    Number(el.dataset.motionDelay ?? el.dataset.animateDelay ?? 0) || 0;
  const start =
    el.dataset.motionStart ?? el.dataset.animateStart ?? "top 80%";
  const once =
    (el.dataset.motionOnce ?? el.dataset.animateOnce) !== "false";
  const tier = resolveMotionTier({
    reducedMotion: false,
    width: window.innerWidth,
  });
  const staggerAmt = motionConfig.stagger[tier];

  if (kind === "stagger") {
    const children = el.querySelectorAll<HTMLElement>(
      el.dataset.motionChildren ||
        el.dataset.animateChildren ||
        ":scope > *",
    );
    if (!children.length) return;

    gsap.set(children, getFromVars("stagger"));
    gsap.to(children, {
      ...getToVars("stagger"),
      delay,
      stagger: staggerAmt,
      scrollTrigger: {
        trigger: el,
        start,
        once,
        toggleActions: "play none none none",
      },
    });
    return;
  }

  if (kind === "image-reveal") {
    const media =
      el.querySelector<HTMLElement>("[data-animate-media], [data-motion-media]") ??
      el.querySelector<HTMLElement>("img") ??
      el;

    gsap.set(el, { overflow: "hidden" });
    gsap.set(media, getFromVars("image-reveal"));
    gsap.to(media, {
      ...getToVars("image-reveal"),
      delay,
      scrollTrigger: {
        trigger: el,
        start,
        once,
        toggleActions: "play none none none",
      },
    });
    return;
  }

  gsap.set(el, getFromVars(kind));
  gsap.to(el, {
    ...getToVars(kind),
    delay,
    scrollTrigger: {
      trigger: el,
      start,
      once,
      toggleActions: "play none none none",
    },
  });
}

function attachParallax(el: HTMLElement) {
  const tier = resolveMotionTier({
    reducedMotion: prefersReducedMotion(),
    width: window.innerWidth,
  });
  if (!featureEnabled("parallax", tier)) return;

  const amount = Number(
    el.dataset.parallax ??
      el.dataset.motionAmount ??
      motionConfig.parallaxY[tier],
  );
  const y = Math.min(Math.abs(amount), 40) * Math.sign(amount || 1);

  gsap.fromTo(
    el,
    { y: -y * 0.35 },
    {
      y: y * 0.65,
      ease: "none",
      scrollTrigger: {
        trigger: el.dataset.parallaxTrigger
          ? document.querySelector(el.dataset.parallaxTrigger) ?? el
          : el.parentElement ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.65,
      },
    },
  );
}

/**
 * Initialize `[data-animate]` / `[data-motion]` / `[data-parallax]`.
 * Uses ScrollTrigger.batch for simple fade-up groups when unmarked siblings share a parent.
 */
export function initScrollAnimations(
  root: HTMLElement | Document = document,
): ReturnType<typeof gsap.context> | null {
  registerGsapPlugins();

  if (prefersReducedMotion()) {
    root.querySelectorAll<HTMLElement>(ANIMATE_SELECTOR).forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.clipPath = "";
    });
    return null;
  }

  const ctx = gsap.context(() => {
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(ANIMATE_SELECTOR),
    );

    nodes.forEach((el) => {
      if (
        el.dataset.animate === "none" ||
        el.dataset.motion === "none" ||
        el.hasAttribute("data-lcp")
      ) {
        return;
      }

      // Sections owning their reveal via useSectionReveal — keep only
      // image-reveal / parallax here to avoid double fades.
      if (el.closest("[data-section-reveal]")) {
        const kind = parseKind(readKind(el));
        if (kind !== "image-reveal" && kind !== "parallax") return;
      }

      revealElement(el, parseKind(readKind(el)));
    });

    root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
      // Skip if already handled as data-motion=parallax
      if (el.dataset.motion === "parallax") return;
      attachParallax(el);
    });
  }, root instanceof Document ? undefined : root);

  return ctx;
}
