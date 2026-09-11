import { gsap, registerGsapPlugins } from "./gsap";
import { EASE_OUT_EXPO, EASE_OUT_SOFT } from "./presets";

export type CursorPreviewState = {
  root: HTMLElement;
  media: HTMLImageElement;
  xTo: ReturnType<typeof gsap.quickTo>;
  yTo: ReturnType<typeof gsap.quickTo>;
  visible: boolean;
};

const ROOT_ID = "xp-cursor-preview";

/**
 * One shared floating media preview for the page.
 * Uses quickTo for inertia — no per-card rAF loops.
 */
export function ensureCursorPreview(): CursorPreviewState {
  registerGsapPlugins();

  let root = document.getElementById(ROOT_ID) as HTMLElement | null;
  let media: HTMLImageElement;

  if (!root) {
    root = document.createElement("div");
    root.id = ROOT_ID;
    root.className = "xp-cursor-preview";
    root.setAttribute("aria-hidden", "true");
    media = document.createElement("img");
    media.alt = "";
    media.draggable = false;
    root.appendChild(media);
    document.body.appendChild(root);
    gsap.set(root, {
      autoAlpha: 0,
      scale: 0.86,
      xPercent: -50,
      yPercent: -50,
      pointerEvents: "none",
    });
  } else {
    media = root.querySelector("img")!;
  }

  const xTo = gsap.quickTo(root, "x", { duration: 0.55, ease: EASE_OUT_EXPO });
  const yTo = gsap.quickTo(root, "y", { duration: 0.55, ease: EASE_OUT_EXPO });

  return { root, media, xTo, yTo, visible: false };
}

export function showCursorPreview(
  state: CursorPreviewState,
  src: string,
  event: PointerEvent,
) {
  state.media.src = src;
  state.xTo(event.clientX);
  state.yTo(event.clientY);
  state.visible = true;
  gsap.to(state.root, {
    autoAlpha: 1,
    scale: 1,
    duration: 0.4,
    ease: EASE_OUT_EXPO,
    overwrite: "auto",
  });
}

export function moveCursorPreview(
  state: CursorPreviewState,
  event: PointerEvent,
) {
  if (!state.visible) return;
  state.xTo(event.clientX);
  state.yTo(event.clientY);
}

export function hideCursorPreview(state: CursorPreviewState) {
  state.visible = false;
  gsap.to(state.root, {
    autoAlpha: 0,
    scale: 0.9,
    duration: 0.35,
    ease: EASE_OUT_SOFT,
    overwrite: "auto",
  });
}

export function destroyCursorPreview() {
  const root = document.getElementById(ROOT_ID);
  if (root) {
    gsap.killTweensOf(root);
    root.remove();
  }
}
