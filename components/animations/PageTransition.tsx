"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  clearLegacyPageTransitionArtifacts,
  getAnimationRoot,
  PAGE_FADE_MS,
  refreshScrollTrigger,
} from "@/lib/animations";

import "./page-transition.css";

/**
 * Fast opacity-only route fade (~180ms).
 *
 * Does NOT intercept clicks or delay navigation — Next.js routes immediately.
 * On pathname change, content fades in before paint (useLayoutEffect).
 * Rapid navigations cancel/replace the previous fade; never leaves opacity stuck at 0.
 */
export function PageTransition() {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const lastPath = useRef(pathname);
  const fadeTimer = useRef(0);
  const rafA = useRef(0);
  const rafB = useRef(0);

  useEffect(() => {
    clearLegacyPageTransitionArtifacts();
  }, []);

  useLayoutEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    if (fadeTimer.current) {
      window.clearTimeout(fadeTimer.current);
      fadeTimer.current = 0;
    }
    if (rafA.current) cancelAnimationFrame(rafA.current);
    if (rafB.current) cancelAnimationFrame(rafB.current);
    rafA.current = 0;
    rafB.current = 0;

    clearLegacyPageTransitionArtifacts();

    const root = getAnimationRoot();
    if (!root) {
      refreshScrollTrigger();
      return;
    }

    if (reduceMotion) {
      root.removeAttribute("data-page-fade");
      refreshScrollTrigger();
      return;
    }

    // Before paint: invisible, no transition. Then fade in on the next frames.
    root.setAttribute("data-page-fade", "out");

    rafA.current = requestAnimationFrame(() => {
      rafB.current = requestAnimationFrame(() => {
        root.setAttribute("data-page-fade", "in");
        fadeTimer.current = window.setTimeout(() => {
          root.removeAttribute("data-page-fade");
          fadeTimer.current = 0;
          refreshScrollTrigger();
        }, PAGE_FADE_MS + 20);
      });
    });

    return () => {
      if (fadeTimer.current) {
        window.clearTimeout(fadeTimer.current);
        fadeTimer.current = 0;
      }
      if (rafA.current) cancelAnimationFrame(rafA.current);
      if (rafB.current) cancelAnimationFrame(rafB.current);
      rafA.current = 0;
      rafB.current = 0;
      root.removeAttribute("data-page-fade");
    };
  }, [pathname, reduceMotion]);

  return null;
}
