"use client";

import type { ReactNode } from "react";

import {
  AnimationProvider,
  HeroEntrance,
  PageTransition,
  Preloader,
} from "@/components/animations";
import { GlobalCustomCursor } from "@/components/effects/global-custom-cursor";
import { GlobalSplashCursor } from "@/components/effects/global-splash-cursor";
import { PageBottomBlur } from "@/components/effects/page-bottom-blur";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Single client boundary for theme, smooth scroll, cursors, GSAP, and page blur.
 * SplashCursor + custom cursor mount once here — never per-section.
 * Custom cursor is deferred until after load / idle (see GlobalCustomCursor).
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
        <AnimationProvider>
          <Preloader />
          <PageTransition />
          <GlobalSplashCursor />
          <GlobalCustomCursor />
          {/* Stack above the fixed fluid canvas (z-0) so UI stays interactive & visible */}
          <div
            data-animation-root
            className="relative z-10 flex min-h-full flex-1 flex-col"
          >
            <HeroEntrance />
            {children}
          </div>
          <PageBottomBlur />
        </AnimationProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
