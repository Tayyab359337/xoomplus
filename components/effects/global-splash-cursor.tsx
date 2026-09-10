"use client";

import dynamic from "next/dynamic";
import { memo } from "react";

import type { SplashCursorProps } from "@/components/effects/splash-cursor.types";
import { useSplashCursorEnabled } from "@/hooks/use-splash-cursor-enabled";

/**
 * Lazy, client-only SplashCursor. Never SSR'd — avoids hydration + WebGL on server.
 */
const SplashCursor = dynamic<SplashCursorProps>(
  () => import("@/components/effects/splash-cursor"),
  {
    ssr: false,
    loading: () => null,
  },
);

/**
 * Site-wide SplashCursor — quiet teal fluid aligned to brand tokens.
 */
function GlobalSplashCursorImpl() {
  const enabled = useSplashCursorEnabled();

  if (!enabled) return null;

  return (
    <SplashCursor
      SIM_RESOLUTION={64}
      DYE_RESOLUTION={512}
      CAPTURE_RESOLUTION={256}
      PRESSURE_ITERATIONS={12}
      DENSITY_DISSIPATION={4.2}
      VELOCITY_DISSIPATION={2.4}
      SPLAT_RADIUS={0.16}
      SPLAT_FORCE={4200}
      COLOR_UPDATE_SPEED={4}
      SHADING={false}
      TRANSPARENT
      RAINBOW_MODE={false}
      // Brand teal — #478997
      COLOR="#478997"
      BACK_COLOR={{ r: 0.016, g: 0.027, b: 0.039 }}
      excludeSelector="[data-hero]"
    />
  );
}

export const GlobalSplashCursor = memo(GlobalSplashCursorImpl);
