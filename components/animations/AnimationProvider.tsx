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
  useState,
  type ReactNode,
} from "react";

import { useSmoothScroll } from "@/components/providers/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  initScrollAnimations,
  refreshScrollTrigger,
  registerGsapPlugins,
  syncScrollTriggerWithLenis,
} from "@/lib/animations";

type AnimationContextValue = {
  ready: boolean;
  preloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;
  reinitScrollAnimations: () => void;
};

const AnimationContext = createContext<AnimationContextValue>({
  ready: false,
  preloaderDone: false,
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
 * Registers GSAP, bridges Lenis ↔ ScrollTrigger, and owns scroll-animation lifecycle.
 */
export function AnimationProvider({ children }: AnimationProviderProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { ready: scrollReady, getInstance } = useSmoothScroll();
  const pathname = usePathname();
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const preloaderDone = reduceMotion || preloaderComplete;
  const ctxRef = useRef<ReturnType<typeof initScrollAnimations>>(null);

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  // Bridge Locomotive/Lenis → ScrollTrigger
  useEffect(() => {
    if (!scrollReady) {
      syncScrollTriggerWithLenis(null);
      return;
    }
    const lenis = getInstance()?.lenisInstance ?? null;
    syncScrollTriggerWithLenis(lenis);
    refreshScrollTrigger();
  }, [scrollReady, getInstance]);

  const setPreloaderDone = useCallback((done: boolean) => {
    setPreloaderComplete(done);
  }, []);

  const reinitScrollAnimations = useCallback(() => {
    ctxRef.current?.revert();
    ctxRef.current = null;

    if (reduceMotion) return;

    const root = document.querySelector<HTMLElement>("[data-animation-root]");
    ctxRef.current = initScrollAnimations(root ?? document);
    requestAnimationFrame(() => refreshScrollTrigger());
  }, [reduceMotion]);

  // Init / re-init after preloader + on route change.
  // Only revert this provider's data-animate context — do not kill
  // section-owned ScrollTriggers from useSectionReveal / kinetic type.
  useGSAP(
    () => {
      if (!preloaderDone) return;

      ctxRef.current?.revert();
      ctxRef.current = null;

      if (reduceMotion) return;

      const root = document.querySelector<HTMLElement>("[data-animation-root]");
      ctxRef.current = initScrollAnimations(root ?? document);

      const t = window.setTimeout(() => refreshScrollTrigger(), 120);
      return () => {
        window.clearTimeout(t);
        ctxRef.current?.revert();
        ctxRef.current = null;
      };
    },
    { dependencies: [preloaderDone, pathname, reduceMotion] },
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
