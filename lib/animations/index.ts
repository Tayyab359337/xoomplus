export {
  ANIMATION_DEBUG,
  featureEnabled,
  motionConfig,
  resolveMotionTier,
  type MotionTier,
} from "./config";

export {
  DUR,
  DUR_HOVER,
  DUR_HOVER_OUT,
  EASE,
  EASE_SOFT,
  ENABLE_ANIMATION_DEBUG,
  gsap,
  isCompactViewport,
  prefersReducedMotion,
  registerGsapPlugins,
  REVEAL_Y,
  SCROLL_START,
  ScrollTrigger,
  STAGGER,
} from "./gsap";

export {
  durations,
  EASE_EDITORIAL,
  EASE_OUT_EXPO,
  EASE_OUT_SOFT,
  getFromVars,
  getToVars,
  presets,
  type AnimateKind,
  type MotionKind,
} from "./presets";

export { attachHoverLift, type HoverLiftOptions } from "./hover";

export {
  ANIMATE_SELECTOR,
  initScrollAnimations,
  killAllScrollTriggers,
  PARALLAX_SELECTOR,
  refreshScrollTrigger,
} from "./scroll-trigger";

export {
  animatePreloaderProgress,
  createPreloaderController,
  createPreloaderTimeline,
  playPreloaderExit,
  PRELOADER_MAX_MS,
  PRELOADER_MIN_MS,
  type PreloaderController,
  type PreloaderElements,
} from "./preloader";

export {
  clearLegacyPageTransitionArtifacts,
  getAnimationRoot,
  PAGE_FADE_MS,
  playPageEnter,
  playPageLeave,
  shouldTransitionLink,
} from "./page-transition";

export {
  revealTextLines,
  splitText,
  type TextSplitMode,
} from "./text";

export { attachMagnetic } from "./magnetic";

export { attachImageHover, attachVelocityThrow } from "./image";

export {
  destroyCursorPreview,
  ensureCursorPreview,
  hideCursorPreview,
  moveCursorPreview,
  showCursorPreview,
  type CursorPreviewState,
} from "./cursor-preview";
