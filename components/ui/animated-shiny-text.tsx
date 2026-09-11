import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
} from "react";

import { cn } from "@/lib/utils";

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

/**
 * Magic UI AnimatedShinyText — CSS shimmer across text.
 * @see https://magicui.design/docs/components/animated-shiny-text
 */
export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-muted-foreground/80 dark:text-muted-foreground/70",

        // Shine effect
        "animate-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient — accent via (Xoomplus), not demo black/white neon
        "bg-linear-to-r from-transparent via-foreground/70 via-50% to-transparent dark:via-accent",

        // Reduced motion
        "motion-reduce:animate-none motion-reduce:bg-none motion-reduce:[background-clip:unset] motion-reduce:text-accent",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default AnimatedShinyText;
