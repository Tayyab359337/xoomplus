"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { PAGE_FADE_MS } from "@/lib/animations";
import { scrollToCurrentHash } from "@/lib/navigation/hash-scroll";

/**
 * Scrolls to `#services` (or any hash) after client navigations to location pages.
 */
export function LocationHashScroll() {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!pathname.startsWith("/locations/") || pathname === "/locations/") {
      return;
    }

    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    const run = () => scrollToCurrentHash(behavior);

    const afterFade = window.setTimeout(run, PAGE_FADE_MS + 40);
    const onHashChange = () => run();

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.clearTimeout(afterFade);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname, reduceMotion]);

  return null;
}
