"use client";

import type { ReactNode } from "react";

import { GlobalSplashCursor } from "@/components/effects/global-splash-cursor";
import { PageBottomBlur } from "@/components/effects/page-bottom-blur";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Single client boundary for theme, smooth scroll, SplashCursor, and page blur.
 * SplashCursor mounts once here — never per-section.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SmoothScrollProvider>
        <GlobalSplashCursor />
        {/* Stack above the fixed fluid canvas (z-0) so UI stays interactive & visible */}
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          {children}
        </div>
        <PageBottomBlur />
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
