"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  SCROLL_COARSE_POINTER_MQ,
  SCROLL_COMPACT_MQ,
  type ScrollToOptions,
  type ScrollToTarget,
} from "@/lib/scroll";

import "locomotive-scroll/locomotive-scroll.css";

type LocomotiveScrollInstance = InstanceType<
  typeof import("locomotive-scroll").default
>;

type SmoothScrollContextValue = {
  enabled: boolean;
  ready: boolean;
  isCompact: boolean;
  scrollTo: (target: ScrollToTarget, options?: ScrollToOptions) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
  getInstance: () => LocomotiveScrollInstance | null;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  enabled: false,
  ready: false,
  isCompact: false,
  scrollTo: () => undefined,
  resize: () => undefined,
  start: () => undefined,
  stop: () => undefined,
  getInstance: () => null,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/** Alias for section authors */
export const useLocomotiveScroll = useSmoothScroll;

type SmoothScrollProviderProps = {
  children: ReactNode;
  /** Set false to keep native scroll (e.g. forms-heavy pages). */
  enabled?: boolean;
};

function getViewportFlags() {
  if (typeof window === "undefined") {
    return { isCompact: false, isCoarse: false };
  }
  return {
    isCompact: window.matchMedia(SCROLL_COMPACT_MQ).matches,
    isCoarse: window.matchMedia(SCROLL_COARSE_POINTER_MQ).matches,
  };
}

/**
 * Global Locomotive Scroll (Lenis-based v5).
 * - Client-only dynamic import (no SSR / hydration mismatch)
 * - Skipped under prefers-reduced-motion
 * - Touch / compact viewports keep native-friendly Lenis options
 * - Parallax on touch stays opt-in via data attributes (not enabled here)
 */
export function SmoothScrollProvider({
  children,
  enabled = true,
}: SmoothScrollProviderProps) {
  const reduceMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const instanceRef = useRef<LocomotiveScrollInstance | null>(null);
  const [instanceReady, setInstanceReady] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const shouldEnable = enabled && !reduceMotion;

  useEffect(() => {
    const compactMq = window.matchMedia(SCROLL_COMPACT_MQ);
    const sync = () => setIsCompact(compactMq.matches);
    sync();
    compactMq.addEventListener("change", sync);
    return () => compactMq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!shouldEnable) {
      return;
    }

    let cancelled = false;

    const boot = async () => {
      // Reset readiness for this boot cycle (async — avoids sync setState-in-effect lint)
      setInstanceReady(false);

      const { default: LocomotiveScroll } = await import("locomotive-scroll");
      if (cancelled) return;

      const { isCompact: compact, isCoarse } = getViewportFlags();

      const scroll = new LocomotiveScroll({
        lenisOptions: {
          // Higher lerp = snappier / closer to native (low lerp feels laggy with WebGL)
          lerp: compact || isCoarse ? 0.35 : 0.22,
          duration: 0.75,
          // Never hijack touch scrolling with sync behavior
          syncTouch: false,
          // Coarse/compact: native wheel; desktop: light smoothing only
          smoothWheel: !(compact || isCoarse),
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          autoResize: true,
        },
      });

      if (cancelled) {
        scroll.destroy();
        return;
      }

      instanceRef.current = scroll;
      setInstanceReady(true);
    };

    void boot();

    return () => {
      cancelled = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [shouldEnable]);

  // Recalculate metrics after client navigations
  useEffect(() => {
    if (!instanceReady) return;
    instanceRef.current?.resize();
  }, [pathname, instanceReady]);

  const scrollTo = useCallback(
    (target: ScrollToTarget, options?: ScrollToOptions) => {
      instanceRef.current?.scrollTo(target, options);
    },
    [],
  );

  const resize = useCallback(() => {
    instanceRef.current?.resize();
  }, []);

  const start = useCallback(() => {
    instanceRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    instanceRef.current?.stop();
  }, []);

  const getInstance = useCallback(() => instanceRef.current, []);

  const value = useMemo(
    () => ({
      enabled: shouldEnable,
      ready: shouldEnable && instanceReady,
      isCompact,
      scrollTo,
      resize,
      start,
      stop,
      getInstance,
    }),
    [
      shouldEnable,
      instanceReady,
      isCompact,
      scrollTo,
      resize,
      start,
      stop,
      getInstance,
    ],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
