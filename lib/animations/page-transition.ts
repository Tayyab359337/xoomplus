/**
 * Minimal helpers for the route fade.
 * Navigation is never delayed — these only tidy leftover DOM from older builds.
 */

const EXIT_LAYER_ID = "xp-page-exit-layer";
const LEGACY_OVERLAY_ID = "xp-page-transition";
const ROOT_SELECTOR = "[data-animation-root]";

export const PAGE_FADE_MS = 180;

export function getAnimationRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(ROOT_SELECTOR);
}

/** Remove clone/overlay leftovers so they never block interaction. */
export function clearLegacyPageTransitionArtifacts() {
  if (typeof document === "undefined") return;
  document.getElementById(EXIT_LAYER_ID)?.remove();
  document.getElementById(LEGACY_OVERLAY_ID)?.remove();
  document.querySelectorAll(".xp-page-exit-layer").forEach((el) => el.remove());
}

/**
 * Whether an internal link is a same-origin route change.
 * Kept for callers that want to skip hash/mailto/external links —
 * the fade itself does not intercept clicks.
 */
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

/** @deprecated No-op — leave animations removed; navigation must never wait. */
export function playPageLeave(): Promise<void> {
  clearLegacyPageTransitionArtifacts();
  return Promise.resolve();
}

/** @deprecated Prefer the CSS fade in PageTransition; kept for import compatibility. */
export function playPageEnter(): Promise<void> {
  clearLegacyPageTransitionArtifacts();
  const root = getAnimationRoot();
  if (root) {
    root.removeAttribute("data-page-fade");
    root.style.removeProperty("opacity");
    root.style.removeProperty("visibility");
    root.style.removeProperty("transform");
  }
  return Promise.resolve();
}
