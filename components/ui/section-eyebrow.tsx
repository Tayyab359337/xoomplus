import React, { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";

type SectionEyebrowProps = {
  children: ReactNode;
  /** Optional section index, e.g. "01" → "01 — About" */
  number?: string;
  className?: string;
  /**
   * `bare` — no arrow (Hero).
   * `mark` — pill + shimmer + subtle arrow (default sections).
   */
  variant?: "bare" | "mark";
  /** Show trailing arrow (default true for `mark`) */
  showArrow?: boolean;
  as?: ElementType;
} & Omit<ComponentPropsWithoutRef<"p">, "children" | "className">;

/**
 * Section subtitle — Magic UI AnimatedShinyText inside a compact pill,
 * matching the Magic UI demo structure with Xoomplus theme tokens.
 */
export function SectionEyebrow({
  children,
  number,
  className,
  variant = "mark",
  showArrow,
  as: Tag = "p",
  ...rest
}: SectionEyebrowProps) {
  const withArrow = showArrow ?? variant === "mark";

  const label = number ? (
    <>
      <span className="tabular-nums">{number}</span>
      <span aria-hidden className="mx-[0.35em] opacity-70">
        —
      </span>
      <span>{children}</span>
    </>
  ) : (
    <span>{children}</span>
  );

  return React.createElement(
    Tag as React.ElementType,
    {
      className: cn("m-0 inline-flex max-w-full", className),
      "data-section-eyebrow": variant,
      ...rest,
    },
    <span
      className={cn(
        "group inline-flex rounded-full border text-base transition-all ease-in",
        "border-border/60 bg-muted/40 text-foreground",
        "hover:bg-muted/70",
        "dark:border-border/50 dark:bg-card/60 dark:hover:bg-card/90",
      )}
    >
      <AnimatedShinyText
        shimmerWidth={100}
        className={cn(
          "mx-0 inline-flex items-center justify-center gap-0",
          "type-meta px-3.5 py-1 uppercase tracking-[0.12em]",
          "transition ease-out hover:duration-300",
          "hover:text-foreground/80 dark:hover:text-muted-foreground",
        )}
      >
        {label}
        {withArrow ? (
          <ArrowRight
            aria-hidden
            className="ml-1 size-3 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
          />
        ) : null}
      </AnimatedShinyText>
    </span>,
  );
}
