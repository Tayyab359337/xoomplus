"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  playPageEnter,
  playPageLeave,
  refreshScrollTrigger,
  shouldTransitionLink,
} from "@/lib/animations";

import "./page-transition.css";

/**
 * Soft content crossfade between App Router navigations.
 * Outgoing page dissolves while the destination begins settling — no black screen.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const transitioning = useRef(false);
  const lastPath = useRef(pathname);
  const programmedLeave = useRef(false);

  // Enter / crossfade when the route changes
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const fromProgrammedLeave = programmedLeave.current;
    programmedLeave.current = false;

    if (reduceMotion) {
      transitioning.current = false;
      return;
    }

    let cancelled = false;

    const run = async () => {
      // Fresh navigations land at top; history traversal keeps browser restoration
      if (fromProgrammedLeave) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      try {
        await playPageEnter();
      } catch {
        /* never block on animation failure */
      }

      if (!cancelled) {
        refreshScrollTrigger();
        transitioning.current = false;
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [pathname, reduceMotion]);

  useEffect(() => {
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
      programmedLeave.current = true;

      void (async () => {
        try {
          if (!reduceMotion) {
            await playPageLeave();
          }
        } catch {
          /* navigate anyway */
        }

        try {
          router.push(`${url.pathname}${url.search}${url.hash}`);
        } catch {
          transitioning.current = false;
          programmedLeave.current = false;
          window.location.assign(url.href);
        }
      })();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduceMotion, router]);

  // Safety: never leave the UI locked if a route update is aborted
  useEffect(() => {
    const unlock = () => {
      if (transitioning.current) {
        // Allow retry after a short grace if navigation stalled
        window.setTimeout(() => {
          if (lastPath.current === pathname) {
            transitioning.current = false;
            programmedLeave.current = false;
          }
        }, 1200);
      }
    };
    window.addEventListener("pageshow", unlock);
    return () => window.removeEventListener("pageshow", unlock);
  }, [pathname]);

  return null;
}
