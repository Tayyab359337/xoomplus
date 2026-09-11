"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAnimation } from "@/components/animations/AnimationProvider";
import { useSmoothScroll } from "@/components/providers/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  killAllScrollTriggers,
  playPageEnter,
  playPageLeave,
  refreshScrollTrigger,
  shouldTransitionLink,
} from "@/lib/animations";

import "./page-transition.css";

/**
 * Intercepts same-origin internal navigations for a short transition veil.
 * Does not block anchors, mailto, tel, external, or download links.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const { preloaderDone } = useAnimation();
  const { scrollTo } = useSmoothScroll();
  const transitioning = useRef(false);
  const lastPath = useRef(pathname);

  // Enter animation when pathname changes after a programmed leave
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    if (reduceMotion || !preloaderDone) {
      transitioning.current = false;
      return;
    }

    let cancelled = false;

    const run = async () => {
      killAllScrollTriggers();
      scrollTo(0, { immediate: true });
      await playPageEnter();
      if (!cancelled) {
        refreshScrollTrigger();
        transitioning.current = false;
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [pathname, reduceMotion, preloaderDone, scrollTo]);

  useEffect(() => {
    if (reduceMotion) return;

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (!shouldTransitionLink(anchor)) return;
      if (transitioning.current) {
        event.preventDefault();
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      event.preventDefault();
      transitioning.current = true;

      void (async () => {
        await playPageLeave();
        router.push(`${url.pathname}${url.search}${url.hash}`);
      })();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduceMotion, router]);

  return null;
}
