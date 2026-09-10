import type {
  ILenisScrollToOptions,
  lenisTargetScrollTo,
} from "locomotive-scroll";

/**
 * Options mapped to Locomotive Scroll v5 `data-scroll-*` attributes.
 * Parallax speed on touch is opt-in only — never forced on mobile.
 */
export type ScrollEffectOptions = {
  /** Parallax multiplier (e.g. 0.5 / -0.3). Ignored on touch unless enableTouchSpeed. */
  speed?: number;
  /** Intersection offsets, e.g. "0,10%" */
  offset?: string;
  /** Element positions considered for intersection */
  position?: string;
  /** Expose progress as a CSS variable on the element */
  cssProgress?: boolean;
  /** Custom event name that receives progress updates */
  eventProgress?: string;
  /** Class added while the element is in view */
  class?: string;
  /** Re-trigger enter/leave each time */
  repeat?: boolean;
  /** Custom event name fired on intersection */
  call?: string;
  ignoreFold?: boolean;
  /**
   * Opt-in parallax on touch devices.
   * Leave false (default) so small/touch screens keep native scroll feel.
   */
  enableTouchSpeed?: boolean;
};

export type ScrollAttributes = Record<string, string | boolean>;

/** Build reusable `data-scroll*` attributes for any element. */
export function getScrollAttrs(
  options: ScrollEffectOptions = {},
): ScrollAttributes {
  const attrs: ScrollAttributes = {
    "data-scroll": true,
  };

  if (options.speed != null) {
    attrs["data-scroll-speed"] = String(options.speed);
  }
  if (options.offset) {
    attrs["data-scroll-offset"] = options.offset;
  }
  if (options.position) {
    attrs["data-scroll-position"] = options.position;
  }
  if (options.cssProgress) {
    attrs["data-scroll-css-progress"] = true;
  }
  if (options.eventProgress) {
    attrs["data-scroll-event-progress"] = options.eventProgress;
  }
  if (options.class) {
    attrs["data-scroll-class"] = options.class;
  }
  if (options.repeat) {
    attrs["data-scroll-repeat"] = true;
  }
  if (options.call) {
    attrs["data-scroll-call"] = options.call;
  }
  if (options.ignoreFold) {
    attrs["data-scroll-ignore-fold"] = true;
  }
  if (options.enableTouchSpeed) {
    attrs["data-scroll-enable-touch-speed"] = true;
  }

  return attrs;
}

/** Desktop-friendly subtle parallax presets (touch parallax still off by default). */
export const scrollPresets = {
  reveal: getScrollAttrs({ repeat: false }),
  parallaxSlow: getScrollAttrs({ speed: 0.35 }),
  parallaxMedium: getScrollAttrs({ speed: 0.6 }),
  parallaxFast: getScrollAttrs({ speed: 1 }),
  parallaxCounter: getScrollAttrs({ speed: -0.25 }),
  progress: getScrollAttrs({ cssProgress: true, repeat: true }),
} as const;

export type ScrollToTarget = lenisTargetScrollTo;
export type ScrollToOptions = ILenisScrollToOptions;

/** Breakpoint under which we treat the viewport as compact (no forced desktop feel). */
export const SCROLL_COMPACT_MQ = "(max-width: 768px)";
export const SCROLL_COARSE_POINTER_MQ = "(pointer: coarse)";
