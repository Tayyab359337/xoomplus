import {
  DUR_HOVER,
  DUR_HOVER_OUT,
  EASE,
  EASE_SOFT,
  gsap,
  registerGsapPlugins,
} from "./gsap";

export type HoverLiftOptions = {
  /** Vertical lift in px (negative = up). Default -4 */
  y?: number;
  /** Scale on hover. Default 1.02 */
  scale?: number;
};

/**
 * Lightweight hover via gsap.quickTo — performant on repeated enter/leave.
 * Returns a cleanup function for use inside useGSAP / gsap.context.
 */
export function attachHoverLift(
  el: HTMLElement,
  opts: HoverLiftOptions = {},
): () => void {
  registerGsapPlugins();

  const y = opts.y ?? -4;
  const scale = opts.scale ?? 1.02;

  const yTo = gsap.quickTo(el, "y", { duration: DUR_HOVER, ease: EASE });
  const scaleTo = gsap.quickTo(el, "scale", {
    duration: DUR_HOVER,
    ease: EASE,
  });

  const onEnter = () => {
    yTo(y);
    scaleTo(scale);
  };

  const onLeave = () => {
    gsap.to(el, {
      y: 0,
      scale: 1,
      duration: DUR_HOVER_OUT,
      ease: EASE_SOFT,
      overwrite: "auto",
    });
  };

  el.addEventListener("pointerenter", onEnter);
  el.addEventListener("pointerleave", onLeave);

  return () => {
    el.removeEventListener("pointerenter", onEnter);
    el.removeEventListener("pointerleave", onLeave);
    gsap.set(el, { clearProps: "transform" });
  };
}
