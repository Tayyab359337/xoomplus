"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import { useIsClient } from "@/hooks/use-is-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const Antigravity = dynamic(() => import("@/components/Antigravity"), { ssr: false, loading: () => null });

function canUseAntigravity() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return !nav.connection?.saveData && !(typeof nav.deviceMemory === "number" && nav.deviceMemory < 4);
}

export function AntigravityBackground() {
  const isClient = useIsClient();
  const compact = useMediaQuery("(max-width: 768px)");
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const light = isClient && resolvedTheme === "light";
  const enabled = isClient && !reduceMotion && canUseAntigravity();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {enabled ? (
        <div className="absolute inset-0 opacity-45 dark:opacity-70">
          <Antigravity count={compact ? 90 : 170} particleSize={1.7} particleShape="sphere" color={light ? "#478997" : "#6AADB8"} ringRadius={12} magnetRadius={14} waveSpeed={0.3} waveAmplitude={0.8} lerpSpeed={0.08} pulseSpeed={2} fieldStrength={12} autoAnimate />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_75%)]" />
      )}
    </div>
  );
}
