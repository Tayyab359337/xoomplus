import { gsap, registerGsapPlugins } from "./gsap";
import { motionConfig } from "./config";
import { EASE_OUT_EXPO, EASE_OUT_SOFT } from "./presets";

/**
 * Physical image hover — quick enter, softer leave.
 * Prefer this over CSS zoom for portfolio / editorial media.
 */
export function attachImageHover(
  container: HTMLElement,
  media: HTMLElement,
  opts: { scale?: number; rotate?: number; y?: number } = {},
): () => void {
  registerGsapPlugins();

  const scale = opts.scale ?? 1.06;
  const rotate = opts.rotate ?? 0.6;
  const y = opts.y ?? -6;

  gsap.set(container, { overflow: "hidden" });
  gsap.set(media, { transformOrigin: "50% 50%", willChange: "transform" });

  const onEnter = () => {
    gsap.to(media, {
      scale,
      y,
      rotate,
      duration: motionConfig.durations.hoverIn,
      ease: EASE_OUT_EXPO,
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    gsap.to(media, {
      scale: 1,
      y: 0,
      rotate: 0,
      duration: motionConfig.durations.hoverOut,
      ease: EASE_OUT_SOFT,
      overwrite: "auto",
      onComplete: () => {
        gsap.set(media, { clearProps: "will-change" });
      },
    });
  };

  container.addEventListener("pointerenter", onEnter);
  container.addEventListener("pointerleave", onLeave);

  return () => {
    container.removeEventListener("pointerenter", onEnter);
    container.removeEventListener("pointerleave", onLeave);
    gsap.killTweensOf(media);
    gsap.set(media, { clearProps: "transform,will-change" });
  };
}

/**
 * One-shot velocity "throw" on pointer move while hovering.
 * Special / featured interactions only.
 */
export function attachVelocityThrow(
  container: HTMLElement,
  media: HTMLElement,
): () => void {
  registerGsapPlugins();

  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  let hovering = false;

  const onEnter = (event: PointerEvent) => {
    hovering = true;
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = performance.now();
    gsap.to(media, {
      scale: 1.04,
      duration: 0.35,
      ease: EASE_OUT_EXPO,
      overwrite: "auto",
    });
  };

  const onMove = (event: PointerEvent) => {
    if (!hovering) return;
    const now = performance.now();
    const dt = Math.max(16, now - lastT);
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = now;

    const vx = (dx / dt) * 16;
    const vy = (dy / dt) * 16;
    const rot = gsap.utils.clamp(-6, 6, vx * 0.35);

    gsap.to(media, {
      x: gsap.utils.clamp(-18, 18, vx * 2.2),
      y: gsap.utils.clamp(-14, 14, vy * 2.2),
      rotation: rot,
      duration: 0.45,
      ease: EASE_OUT_SOFT,
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    hovering = false;
    gsap.to(media, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.7,
      ease: EASE_OUT_EXPO,
      overwrite: "auto",
    });
  };

  container.addEventListener("pointerenter", onEnter);
  container.addEventListener("pointermove", onMove);
  container.addEventListener("pointerleave", onLeave);

  return () => {
    container.removeEventListener("pointerenter", onEnter);
    container.removeEventListener("pointermove", onMove);
    container.removeEventListener("pointerleave", onLeave);
    gsap.killTweensOf(media);
    gsap.set(media, { clearProps: "transform" });
  };
}
