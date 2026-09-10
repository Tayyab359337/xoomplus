"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query. SSR fallback is `false` unless overridden.
 */
export function useMediaQuery(query: string, ssrFallback = false): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(query).matches,
    () => ssrFallback,
  );
}
