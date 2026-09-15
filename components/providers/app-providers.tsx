"use client";

import type { ReactNode } from "react";

import {
  AnimationProvider,
  HeroEntrance,
  PageTransition,
} from "@/components/animations";
import { PageBottomBlur } from "@/components/effects/page-bottom-blur";
import { ThemeProvider } from "@/components/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Single client boundary for theme, GSAP, and page blur.
 * Native browser cursor only — no splash cursor / custom cursor.
 * No preloader — route changes use a non-blocking ~180ms opacity fade.
 * Native window scrolling.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
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
    </ThemeProvider>
  );
}
