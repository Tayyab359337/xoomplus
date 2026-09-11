/**
 * Central motion intensity config.
 * Desktop gets the full language; tablet/mobile/reduced strip costly effects.
 */

export const ANIMATION_DEBUG = false;

export type MotionTier = "desktop" | "tablet" | "mobile" | "reduced";

export const motionConfig = {
  debug: ANIMATION_DEBUG,

  /** Entrance y travel (px) */
  revealY: {
    desktop: 40,
    tablet: 28,
    mobile: 18,
    reduced: 0,
  },

  /** Image reveal start scale */
  imageScaleFrom: {
    desktop: 1.08,
    tablet: 1.05,
    mobile: 1.03,
    reduced: 1,
  },

  /** Parallax max travel (px) */
  parallaxY: {
    desktop: 28,
    tablet: 14,
    mobile: 0,
    reduced: 0,
  },

  stagger: {
    desktop: 0.08,
    tablet: 0.06,
    mobile: 0.04,
    reduced: 0,
  },

  durations: {
    entrance: 0.85,
    image: 1.05,
    micro: 0.32,
    magnetic: 0.45,
    hoverIn: 0.45,
    hoverOut: 0.65,
    transition: 0.4,
  },

  features: {
    customCursor: { desktop: true, tablet: false, mobile: false, reduced: false },
    cursorPreview: { desktop: true, tablet: false, mobile: false, reduced: false },
    magnetic: { desktop: true, tablet: false, mobile: false, reduced: false },
    velocityThrow: { desktop: true, tablet: false, mobile: false, reduced: false },
    parallax: { desktop: true, tablet: true, mobile: false, reduced: false },
    scrubTypography: { desktop: true, tablet: true, mobile: false, reduced: false },
    kineticType: { desktop: true, tablet: true, mobile: false, reduced: false },
    imageHover: { desktop: true, tablet: true, mobile: false, reduced: false },
  },
} as const;

export function resolveMotionTier(opts: {
  reducedMotion: boolean;
  width?: number;
}): MotionTier {
  if (opts.reducedMotion) return "reduced";
  const w = opts.width ?? (typeof window !== "undefined" ? window.innerWidth : 1440);
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function featureEnabled(
  feature: keyof typeof motionConfig.features,
  tier: MotionTier,
): boolean {
  return motionConfig.features[feature][tier];
}
