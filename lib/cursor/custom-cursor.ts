/**
 * Premium custom cursor — vanilla, GPU-friendly, idle-aware.
 * No libraries. rAF only while the pointer is moving / settling.
 */

export type CustomCursorHandle = {
  destroy: () => void;
};

type CursorMode = "default" | "hover" | "card" | "drag" | "text" | "native";

const ROOT_ID = "xp-custom-cursor";
const HTML_ON = "xp-cursor-on";
const HTML_NATIVE = "xp-cursor-native";

/** High-priority interactive targets (event delegation). */
const INTERACTIVE_SEL = [
  "a[href]",
  "button",
  "summary",
  "label[for]",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[role='option']",
  "[role='tab']",
  "[role='switch']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='slider']",
  "[data-magnetic]",
  "[data-slot='button']",
  "[data-slot='slider-thumb']",
  ".cursor-pointer",
].join(",");

const CARD_SEL =
  "[data-xp-cursor='card'], [data-slot='card'], [data-portfolio-card], [data-services-card]";
const DRAG_SEL =
  "[data-xp-cursor='drag'], [draggable='true'], .cursor-grab, [data-dragging]";
const TEXT_SEL =
  "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']):not([type='range']):not([type='color']):not([type='file']), textarea, [contenteditable='true'], [data-xp-cursor='text']";
const NATIVE_SEL = "iframe, [data-xp-cursor='native']";

/** Dot lerp — snappy. Follower lerp — subtle lag only. */
const DOT_LERP = 0.62;
const RING_LERP = 0.22;
const SETTLE_EPS = 0.08;

function prefersFinePointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";

  if (target.closest(NATIVE_SEL)) return "native";
  if (target.closest(TEXT_SEL)) return "text";

  // Portfolio / explicit cards before generic role=button
  if (target.closest(CARD_SEL)) return "card";

  const explicit = target.closest("[data-xp-cursor]") as HTMLElement | null;
  if (explicit) {
    const v = explicit.getAttribute("data-xp-cursor");
    if (v === "hover" || v === "text" || v === "native") return v;
    // "drag" on a large surface is a fallback — only if nothing tighter matches
    if (v === "drag" && !target.closest(INTERACTIVE_SEL)) return "drag";
  }

  if (target.closest(INTERACTIVE_SEL)) return "hover";
  if (target.closest(DRAG_SEL)) return "drag";

  return "default";
}

function canInit(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (!prefersFinePointer()) return false;
  if (window.matchMedia("(max-width: 768px)").matches) return false;
  return true;
}

let active: CustomCursorHandle | null = null;

/**
 * Mount the custom cursor. Safe to call once; returns a destroy handle.
 * No-ops when the environment should keep the native cursor.
 */
export function initCustomCursor(): CustomCursorHandle | null {
  if (!canInit()) return null;
  if (active) return active;

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.className = "xp-cursor";
  root.setAttribute("aria-hidden", "true");

  const dot = document.createElement("div");
  dot.className = "xp-cursor__dot";
  dot.appendChild(document.createElement("i"));

  const ring = document.createElement("div");
  ring.className = "xp-cursor__ring";
  ring.appendChild(document.createElement("i"));

  root.append(dot, ring);
  document.body.appendChild(root);
  document.documentElement.classList.add(HTML_ON);

  let mode: CursorMode = "default";
  let visible = false;
  let pressed = false;
  let paused = document.hidden;

  let targetX = -100;
  let targetY = -100;
  let dotX = -100;
  let dotY = -100;
  let ringX = -100;
  let ringY = -100;

  let raf = 0;
  let hoverRaf = 0;
  let pendingTarget: EventTarget | null = null;

  const applyTransforms = () => {
    // Single write path — transform only, no layout reads
    dot.style.transform = `translate3d(${dotX}px,${dotY}px,0) translate(-50%,-50%)`;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;
  };

  const setVisible = (next: boolean) => {
    if (visible === next) return;
    visible = next;
    root.classList.toggle("is-visible", next);
  };

  const setMode = (next: CursorMode) => {
    if (mode === next) return;
    mode = next;
    root.dataset.mode = next;

    const useNative = next === "native" || next === "text";
    document.documentElement.classList.toggle(HTML_NATIVE, useNative);
    root.classList.toggle("is-hidden", useNative);
  };

  const setPressed = (next: boolean) => {
    if (pressed === next) return;
    pressed = next;
    root.classList.toggle("is-pressed", next);
  };

  const scheduleTick = () => {
    if (paused || raf) return;
    raf = requestAnimationFrame(tick);
  };

  const tick = () => {
    raf = 0;
    if (paused) return;

    const dx = targetX - dotX;
    const dy = targetY - dotY;
    const rx = targetX - ringX;
    const ry = targetY - ringY;

    dotX += dx * DOT_LERP;
    dotY += dy * DOT_LERP;
    ringX += rx * RING_LERP;
    ringY += ry * RING_LERP;

    applyTransforms();

    const moving =
      Math.abs(targetX - dotX) > SETTLE_EPS ||
      Math.abs(targetY - dotY) > SETTLE_EPS ||
      Math.abs(targetX - ringX) > SETTLE_EPS ||
      Math.abs(targetY - ringY) > SETTLE_EPS;

    if (moving) {
      raf = requestAnimationFrame(tick);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    targetX = e.clientX;
    targetY = e.clientY;
    if (!visible) {
      // Snap on first reveal to avoid a long catch-up trail
      dotX = ringX = targetX;
      dotY = ringY = targetY;
      applyTransforms();
      setVisible(true);
    }
    scheduleTick();
  };

  const flushHover = () => {
    hoverRaf = 0;
    setMode(resolveMode(pendingTarget));
  };

  const onPointerOver = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pendingTarget = e.target;
    if (hoverRaf) return;
    // Coalesce hover resolution to one pass per frame
    hoverRaf = requestAnimationFrame(flushHover);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setPressed(true);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setPressed(false);
  };

  const onDocLeave = () => {
    setVisible(false);
    setPressed(false);
  };

  const onVisibility = () => {
    paused = document.hidden;
    if (paused) {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (hoverRaf) {
        cancelAnimationFrame(hoverRaf);
        hoverRaf = 0;
      }
      setVisible(false);
      setPressed(false);
    }
  };

  const onMqChange = () => {
    if (!canInit()) destroy();
  };

  const fineMq = window.matchMedia("(pointer: fine)");
  const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactMq = window.matchMedia("(max-width: 768px)");

  // Passive where possible — never block scroll / click
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("pointerup", onPointerUp, { passive: true });
  document.addEventListener("pointercancel", onPointerUp, { passive: true });
  document.documentElement.addEventListener("mouseleave", onDocLeave);
  document.addEventListener("visibilitychange", onVisibility);
  fineMq.addEventListener("change", onMqChange);
  reduceMq.addEventListener("change", onMqChange);
  compactMq.addEventListener("change", onMqChange);

  root.dataset.mode = "default";

  const destroy = () => {
    if (active !== handle) return;
    active = null;
    if (raf) cancelAnimationFrame(raf);
    if (hoverRaf) cancelAnimationFrame(hoverRaf);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerover", onPointerOver);
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("pointercancel", onPointerUp);
    document.documentElement.removeEventListener("mouseleave", onDocLeave);
    document.removeEventListener("visibilitychange", onVisibility);
    fineMq.removeEventListener("change", onMqChange);
    reduceMq.removeEventListener("change", onMqChange);
    compactMq.removeEventListener("change", onMqChange);
    document.documentElement.classList.remove(HTML_ON, HTML_NATIVE);
    root.remove();
  };

  const handle: CustomCursorHandle = { destroy };
  active = handle;
  return handle;
}

export function destroyCustomCursor() {
  active?.destroy();
}
