"use client";

import { useSyncExternalStore } from "react";

export type ServicesInteractionMode = "hover" | "tap";

const TAP_MQ = "(max-width: 1023px)";

function getMode(): ServicesInteractionMode {
  if (window.matchMedia(TAP_MQ).matches) return "tap";
  return "hover";
}

function subscribe(onStoreChange: () => void) {
  const tap = window.matchMedia(TAP_MQ);
  tap.addEventListener("change", onStoreChange);
  return () => tap.removeEventListener("change", onStoreChange);
}

/**
 * Desktop hover / tablet+mobile tap.
 * Mobile uses the same infinite carousel as tablet (tap to expand).
 */
export function useServicesInteractionMode(): ServicesInteractionMode {
  return useSyncExternalStore(subscribe, getMode, () => "tap");
}
