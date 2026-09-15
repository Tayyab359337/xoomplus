"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  initScrollAnimations,
  refreshScrollTrigger,
  registerGsapPlugins,
} from "@/lib/animations";

type AnimationContextValue = {
  ready: boolean;
  /** Always true — preloader removed; kept for call-site compatibility */
  preloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;
  reinitScrollAnimations: () => void;
};

const AnimationContext = createContext<AnimationContextValue>({
  ready: true,
  preloaderDone: true,
  setPreloaderDone: () => undefined,
  reinitScrollAnimations: () => undefined,
});

export function useAnimation() {
  return useContext(AnimationContext);
}

type AnimationProviderProps = {
  children: ReactNode;
};

/**
 * Registers GSAP and owns scroll-animation lifecycle on native window scroll.
 * Preloader is retired — animations start immediately.
 */
export function AnimationProvider({ children }: AnimationProviderProps) {
  const reduceMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const preloaderDone = true;
  const ctxRef = useRef<ReturnType<typeof initScrollAnimations>>(null);

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  const setPreloaderDone = useCallback((_done: boolean) => {
    // no-op — preloader removed
  }, []);

  const reinitScrollAnimations = useCallback(() => {
    ctxRef.current?.revert();
    ctxRef.current = null;

    if (reduceMotion) return;

    const root = document.querySelector<HTMLElement>("[data-animation-root]");
    ctxRef.current = initScrollAnimations(root ?? document);
    requestAnimationFrame(() => refreshScrollTrigger());
  }, [reduceMotion]);

  // Init / re-init on mount + route change — deferred until idle so LCP wins.
  // Only revert this provider's data-animate context — do not kill
  // section-owned ScrollTriggers from useSectionReveal / kinetic type.
  useGSAP(
    () => {
      ctxRef.current?.revert();
      ctxRef.current = null;

      if (reduceMotion) return;

      let idleId = 0;
      let timeoutId = 0;
      let refreshTimeout = 0;

      const start = () => {
        const root = document.querySelector<HTMLElement>("[data-animation-root]");
        ctxRef.current = initScrollAnimations(root ?? document);
        refreshTimeout = window.setTimeout(() => refreshScrollTrigger(), 280);
      };

      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(start, { timeout: 1200 });
      } else {
        timeoutId = window.setTimeout(start, 50);
      }

      return () => {
        if (idleId && typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        }
        if (timeoutId) window.clearTimeout(timeoutId);
        if (refreshTimeout) window.clearTimeout(refreshTimeout);
        ctxRef.current?.revert();
        ctxRef.current = null;
      };
    },
    { dependencies: [pathname, reduceMotion] },
  );

  const value = useMemo(
    () => ({
      ready: preloaderDone,
      preloaderDone,
      setPreloaderDone,
      reinitScrollAnimations,
    }),
    [preloaderDone, setPreloaderDone, reinitScrollAnimations],
  );

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}
