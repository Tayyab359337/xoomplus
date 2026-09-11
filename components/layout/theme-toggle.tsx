"use client";

import { useTheme } from "next-themes";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

/**
 * Magic UI Animated Theme Toggler wired to next-themes.
 * Default theme remains light via ThemeProvider.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-md border border-border/50",
          className,
        )}
      />
    );
  }

  const theme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <AnimatedThemeToggler
      theme={theme}
      onThemeChange={setTheme}
      duration={520}
      variant="circle"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border border-border/60 bg-background/40 text-foreground transition-colors hover:bg-hover hover:text-hover-foreground",
        "[&_svg]:size-4",
        className,
      )}
    />
  );
}
