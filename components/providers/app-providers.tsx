"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import {
  AnimationProvider,
  PageTransition,
} from "@/components/animations";
import { ThemeProvider } from "@/components/providers/theme-provider";

const HeroEntrance = dynamic(
  () =>
    import("@/components/animations/HeroEntrance").then((m) => ({
      default: m.HeroEntrance,
    })),
  { ssr: false },
);

const PageBottomBlur = dynamic(
  () =>
    import("@/components/effects/page-bottom-blur").then((m) => ({
      default: m.PageBottomBlur,
    })),
  { ssr: false },
);

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Single client boundary for theme, GSAP, and page blur.
 * Native browser cursor only — no splash cursor / custom cursor.
 * No preloader — route changes use a non-blocking ~180ms opacity fade.
 * Native window scrolling.
 * HeroEntrance + bottom blur load after hydration so they never block LCP.
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
