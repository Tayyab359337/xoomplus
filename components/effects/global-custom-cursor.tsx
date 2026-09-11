"use client";

import { memo, useEffect } from "react";

import { useCustomCursorEnabled } from "@/hooks/use-custom-cursor-enabled";

type IdleWindow = Window & {
  requestIdleCallback?: (
    cb: IdleRequestCallback,
    opts?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Deferred custom cursor — loads after the page is interactive / idle.
 * Zero SSR cost; no impact on LCP / FCP critical path.
 */
function GlobalCustomCursorImpl() {
  const enabled = useCustomCursorEnabled();

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let destroy: (() => void) | undefined;
    let idleId = 0;
    let timeoutId = 0;

    const boot = () => {
      if (cancelled) return;
      // Dynamic import keeps the engine off the critical bundle
      void import("@/lib/cursor").then(({ initCustomCursor }) => {
        if (cancelled) return;
        const handle = initCustomCursor();
        destroy = handle?.destroy;
      });
    };

    const schedule = () => {
      const w = window as IdleWindow;
      if (typeof w.requestIdleCallback === "function") {
        idleId = w.requestIdleCallback(boot, { timeout: 2500 });
      } else {
        timeoutId = window.setTimeout(boot, 200);
      }
    };

    // Wait until after first paint + load so ATF work is not competing
    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      const w = window as IdleWindow;
      if (idleId && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
      destroy?.();
    };
  }, [enabled]);

  return null;
}

export const GlobalCustomCursor = memo(GlobalCustomCursorImpl);
