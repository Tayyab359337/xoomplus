import {
  gsap,
  prefersReducedMotion,
  registerGsapPlugins,
} from "./gsap";
import { durations, EASE_OUT_EXPO, EASE_OUT_SOFT } from "./presets";

const OVERLAY_ID = "xp-page-transition";

function ensureOverlay(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let el = document.getElementById(OVERLAY_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = OVERLAY_ID;
    el.setAttribute("aria-hidden", "true");
    el.className = "xp-page-transition";
    document.body.appendChild(el);
  }
  return el;
}

/**
 * Short leave transition (~250–400ms).
 * Resolves when the route may change.
 */
export function playPageLeave(): Promise<void> {
  registerGsapPlugins();

  if (prefersReducedMotion()) {
    return Promise.resolve();
  }

  const overlay = ensureOverlay();
  if (!overlay) return Promise.resolve();

  return new Promise((resolve) => {
    gsap.set(overlay, {
      autoAlpha: 1,
      pointerEvents: "none",
      clipPath: "inset(100% 0 0 0)",
    });

    gsap.to(overlay, {
      clipPath: "inset(0% 0 0 0)",
      duration: durations.transition,
      ease: EASE_OUT_EXPO,
      onComplete: () => resolve(),
    });
  });
}

/** Enter transition after the new route mounts. */
export function playPageEnter(): Promise<void> {
  registerGsapPlugins();

  if (prefersReducedMotion()) {
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
    }
    return Promise.resolve();
  }

  const overlay = ensureOverlay();
  if (!overlay) return Promise.resolve();

  return new Promise((resolve) => {
    gsap.to(overlay, {
      clipPath: "inset(0 0 100% 0)",
      duration: durations.transition * 0.9,
      ease: EASE_OUT_SOFT,
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: "none", autoAlpha: 0 });
        resolve();
      },
    });
  });
}

/** Whether a click should use the app page transition */
export function shouldTransitionLink(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute("href");
  if (!href) return false;

  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:") ||
    href.startsWith("blob:") ||
    href.startsWith("data:")
  ) {
    return false;
  }

  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  if (anchor.dataset.noTransition != null) return false;

  if (href.startsWith("#")) return false;

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
