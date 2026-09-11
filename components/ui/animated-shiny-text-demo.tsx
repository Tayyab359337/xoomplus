import { ArrowRight } from "lucide-react";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";

/**
 * Magic UI AnimatedShinyText demo — adapted to Xoomplus theme tokens.
 * Reference pattern for SectionEyebrow pills.
 */
export function AnimatedShinyTextDemo() {
  return (
    <div className="z-10 flex min-h-64 items-center justify-center">
      <div
        className={cn(
          "group rounded-full border border-border/60 bg-muted/40 text-base text-foreground transition-all ease-in hover:cursor-pointer hover:bg-muted/70",
          "dark:border-border/50 dark:bg-card/60 dark:hover:bg-card/90",
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-foreground/80 hover:duration-300 hover:dark:text-muted-foreground">
          <span>✨ Introducing Xoomplus</span>
          <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </div>
  );
}
