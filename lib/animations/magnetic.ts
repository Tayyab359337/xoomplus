import { gsap, registerGsapPlugins } from "./gsap";
import { motionConfig } from "./config";
import { EASE_OUT_EXPO, EASE_OUT_SOFT } from "./presets";

type MagneticOptions = {
  strength?: number;
  radius?: number;
};

/**
 * Subtle magnetic pull for buttons / arrows.
 * Desktop only — caller should gate with motionConfig features.
 */
export function attachMagnetic(
  el: HTMLElement,
  opts: MagneticOptions = {},
): () => void {
  registerGsapPlugins();

  const strength = opts.strength ?? 0.28;
  const radius = opts.radius ?? 80;
  const xTo = gsap.quickTo(el, "x", {
    duration: motionConfig.durations.magnetic,
    ease: EASE_OUT_EXPO,
  });
  const yTo = gsap.quickTo(el, "y", {
    duration: motionConfig.durations.magnetic,
    ease: EASE_OUT_EXPO,
  });

  const onMove = (event: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius * 2.2) {
      xTo(0);
      yTo(0);
      return;
    }
    xTo(dx * strength);
    yTo(dy * strength);
  };

  const onLeave = () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: motionConfig.durations.hoverOut,
      ease: EASE_OUT_SOFT,
      overwrite: "auto",
    });
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);

  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
    gsap.set(el, { clearProps: "transform" });
  };
}
