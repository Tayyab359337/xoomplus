"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type MagnetProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
};

type MagnetEntry = {
  wrapper: HTMLDivElement;
  inner: HTMLDivElement;
  padding: number;
  magnetStrength: number;
  activeTransition: string;
  inactiveTransition: string;
  active: boolean;
};

/** One window listener for all Magnets — avoids N× mousemove + React re-renders. */
const registry = new Set<MagnetEntry>();
let pointerAttached = false;
let raf = 0;
let pendingX = 0;
let pendingY = 0;
let scrolling = false;
let scrollIdleTimer = 0;

function onWindowScroll() {
  scrolling = true;
  if (scrollIdleTimer) window.clearTimeout(scrollIdleTimer);
  scrollIdleTimer = window.setTimeout(() => {
    scrolling = false;
    scrollIdleTimer = 0;
  }, 120);
}

function flushPointer() {
  raf = 0;
  // Skip magnet work while the user is scrolling — pointermove often fires with trackpads.
  if (scrolling || registry.size === 0) return;

  const x = pendingX;
  const y = pendingY;
  const vh = window.innerHeight;
  for (const entry of registry) {
    const { wrapper, inner, padding, magnetStrength } = entry;
    const { left, top, width, height } = wrapper.getBoundingClientRect();
    // Skip off-screen magnets — no layout work / transforms while scrolling past.
    if (top > vh + padding || top + height < -padding) {
      if (entry.active) {
        entry.active = false;
        inner.style.transition = entry.inactiveTransition;
        inner.style.transform = "translate3d(0px, 0px, 0)";
      }
      continue;
    }
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distX = Math.abs(centerX - x);
    const distY = Math.abs(centerY - y);

    if (distX < width / 2 + padding && distY < height / 2 + padding) {
      if (!entry.active) {
        entry.active = true;
        inner.style.transition = entry.activeTransition;
      }
      inner.style.transform = `translate3d(${(x - centerX) / magnetStrength}px, ${(y - centerY) / magnetStrength}px, 0)`;
    } else if (entry.active) {
      entry.active = false;
      inner.style.transition = entry.inactiveTransition;
      inner.style.transform = "translate3d(0px, 0px, 0)";
    }
  }
}

function onPointerMove(e: PointerEvent) {
  pendingX = e.clientX;
  pendingY = e.clientY;
  if (!raf) raf = requestAnimationFrame(flushPointer);
}

function ensurePointer() {
  if (pointerAttached || typeof window === "undefined") return;
  if (window.matchMedia("(pointer: coarse)").matches) return;
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onWindowScroll, { passive: true });
  pointerAttached = true;
}

function releasePointerIfIdle() {
  if (registry.size > 0 || !pointerAttached) return;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("scroll", onWindowScroll);
  pointerAttached = false;
  if (raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
  if (scrollIdleTimer) {
    window.clearTimeout(scrollIdleTimer);
    scrollIdleTimer = 0;
  }
  scrolling = false;
}

/**
 * Pointer attraction for CTAs — DOM transforms only (no React state on move).
 * Skips entirely on coarse pointers / touch.
 */
export default function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}: MagnetProps) {
  const magnetRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = magnetRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || disabled) {
      if (inner) {
        inner.style.transition = inactiveTransition;
        inner.style.transform = "translate3d(0px, 0px, 0)";
      }
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const entry: MagnetEntry = {
      wrapper,
      inner,
      padding,
      magnetStrength,
      activeTransition,
      inactiveTransition,
      active: false,
    };

    registry.add(entry);
    ensurePointer();

    return () => {
      registry.delete(entry);
      entry.active = false;
      inner.style.transition = inactiveTransition;
      inner.style.transform = "translate3d(0px, 0px, 0)";
      releasePointerIfIdle();
    };
  }, [
    padding,
    disabled,
    magnetStrength,
    activeTransition,
    inactiveTransition,
  ]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={
          {
            transform: "translate3d(0px, 0px, 0)",
            transition: inactiveTransition,
            willChange: "transform",
          } satisfies CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
