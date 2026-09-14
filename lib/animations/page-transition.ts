import {
  gsap,
  isCompactViewport,
  prefersReducedMotion,
  registerGsapPlugins,
} from "./gsap";
import { EASE_OUT_EXPO, EASE_OUT_SOFT } from "./presets";

const EXIT_LAYER_ID = "xp-page-exit-layer";
const ROOT_SELECTOR = "[data-animation-root]";

/** Outgoing soften — keeps page visible while navigation starts */
const LEAVE_DURATION = 0.18;
/** Resolve leave early so the route changes mid-fade (overlap) */
const LEAVE_HANDOFF = 0.09;
/** Incoming settle */
const ENTER_DURATION = 0.3;
/** Incoming starts slightly after outgoing continues dissolving */
const ENTER_STAGGER = 0.05;

function exitOffsetY() {
  return isCompactViewport() ? -5 : -8;
}

function enterOffsetY() {
  return isCompactViewport() ? 5 : 8;
}

function getRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(ROOT_SELECTOR);
}

function removeExitLayer() {
  document.getElementById(EXIT_LAYER_ID)?.remove();
}

/** Strip legacy black veil if an older build left it in the DOM */
function removeLegacyOverlay() {
  document.getElementById("xp-page-transition")?.remove();
}

/**
 * Snapshot the current page into a fixed layer, then hand off quickly.
 * Navigation should start while this layer is still faintly visible.
 */
export function playPageLeave(): Promise<void> {
  registerGsapPlugins();
  removeLegacyOverlay();

  if (prefersReducedMotion()) {
    removeExitLayer();
    return Promise.resolve();
  }

  const root = getRoot();
  if (!root) return Promise.resolve();

  removeExitLayer();

  const rect = root.getBoundingClientRect();
  const clone = root.cloneNode(true) as HTMLElement;
  clone.id = EXIT_LAYER_ID;
  clone.setAttribute("aria-hidden", "true");
  clone.classList.add("xp-page-exit-layer");
  clone.style.top = `${Math.round(rect.top)}px`;
  clone.style.width = `${Math.round(rect.width)}px`;
  clone.style.left = `${Math.round(rect.left)}px`;

  document.body.appendChild(clone);

  // Hide live root — clone carries the visual until the next route mounts
  gsap.set(root, { autoAlpha: 0 });

  gsap.killTweensOf(clone);
  gsap.fromTo(
    clone,
    { autoAlpha: 1, y: 0 },
    {
      autoAlpha: 0.82,
      y: exitOffsetY() * 0.35,
      duration: LEAVE_DURATION,
      ease: EASE_OUT_SOFT,
    },
  );

  // Handoff early — destination can mount while the clone is still dissolving
  return new Promise((resolve) => {
    gsap.delayedCall(LEAVE_HANDOFF, () => resolve());
  });
}

/**
 * Crossfade: finish dissolving the exit snapshot while the new root settles in.
 * Safe if there is no exit layer (back/forward / direct entry).
 */
export function playPageEnter(): Promise<void> {
  registerGsapPlugins();
  removeLegacyOverlay();

  const root = getRoot();
  const clone = document.getElementById(EXIT_LAYER_ID);

  if (prefersReducedMotion()) {
    removeExitLayer();
    if (root) gsap.set(root, { clearProps: "opacity,visibility,transform" });
    return Promise.resolve();
  }

  if (!root) {
    removeExitLayer();
    return Promise.resolve();
  }

  gsap.killTweensOf([root, clone].filter(Boolean));

  const yIn = enterOffsetY();
  const yOut = exitOffsetY();

  gsap.set(root, { autoAlpha: 0, y: yIn });

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT_EXPO },
      onComplete: () => {
        removeExitLayer();
        gsap.set(root, { clearProps: "opacity,visibility,transform" });
        resolve();
      },
    });

    if (clone) {
      tl.to(
        clone,
        {
          autoAlpha: 0,
          y: yOut,
          duration: 0.2,
          ease: EASE_OUT_SOFT,
        },
        0,
      );
    }

    tl.to(
      root,
      {
        autoAlpha: 1,
        y: 0,
        duration: ENTER_DURATION,
        ease: EASE_OUT_EXPO,
      },
      clone ? ENTER_STAGGER : 0,
    );
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
