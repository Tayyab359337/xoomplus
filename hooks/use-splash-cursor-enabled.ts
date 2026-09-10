"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const COMPACT_MQ = "(max-width: 768px)";
const COARSE_MQ = "(pointer: coarse)";
const REDUCE_DATA_MQ = "(prefers-reduced-data: reduce)";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function evaluateSplashCapability(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as NavigatorWithHints;

  // Low-power / constrained environments
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;

  // Touch / compact viewports — WebGL fluid is expensive and poor UX on small screens
  if (window.matchMedia(COMPACT_MQ).matches) return false;
  if (window.matchMedia(COARSE_MQ).matches) return false;
  if (window.matchMedia(REDUCE_DATA_MQ).matches) return false;

  // Basic WebGL probe (cheap, no context attributes beyond defaults)
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
  } catch {
    return false;
  }

  return true;
}

/**
 * Whether the full SplashCursor effect should run on this device/session.
 * Combines prefers-reduced-motion with mobile / low-power heuristics.
 */
export function useSplashCursorEnabled(): boolean {
  const reduceMotion = usePrefersReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const update = () => setCapable(evaluateSplashCapability());
    update();

    const compact = window.matchMedia(COMPACT_MQ);
    const coarse = window.matchMedia(COARSE_MQ);
    compact.addEventListener("change", update);
    coarse.addEventListener("change", update);

    return () => {
      compact.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);

  return !reduceMotion && capable;
}
