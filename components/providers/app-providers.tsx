"use client";

import type { ReactNode } from "react";

import {
  AnimationProvider,
  HeroEntrance,
  PageTransition,
} from "@/components/animations";
import { PageBottomBlur } from "@/components/effects/page-bottom-blur";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Single client boundary for theme, smooth scroll, GSAP, and page blur.
 * Native browser cursor only — no splash cursor / custom cursor.
 * No preloader — page transitions stay active.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SmoothScrollProvider>
        <AnimationProvider>
          <PageTransition />
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
