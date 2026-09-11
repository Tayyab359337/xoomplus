"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 100;

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  className,
  triggerClassName,
  href,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  href?: string;
}) => {
  return (
    <div
      onMouseEnter={() => setActive(item)}
      className={cn("relative", className)}
    >
      <motion.a
        href={href}
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer text-foreground/70 transition-colors hover:text-foreground",
          triggerClassName,
        )}
        aria-haspopup="true"
        aria-expanded={active === item}
      >
        {item}
      </motion.a>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 -translate-x-1/2 transform pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="overflow-hidden rounded-2xl border border-border/60 bg-background/95 shadow-xl backdrop-blur-sm"
              >
                <motion.div layout className="h-full w-max p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  active,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  children: React.ReactNode;
  className?: string;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const clearLeaveTimer = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const close = () => {
    clearLeaveTimer();
    setActive(null);
  };

  const scheduleClose = () => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setActive(null);
      leaveTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  };

  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close on route change only
  }, [pathname]);

  useEffect(() => {
    if (active === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const onPointerDown = (event: MouseEvent | PointerEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => () => clearLeaveTimer(), []);

  return (
    <div
      ref={rootRef}
      onMouseEnter={clearLeaveTimer}
      onMouseLeave={scheduleClose}
      className={cn("relative flex items-center", className)}
    >
      {children}
    </div>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex max-w-[16rem] space-x-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- Aceternity ProductItem default */}
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="mb-1 font-display text-base font-semibold text-foreground">
          {title}
        </h4>
        <p className="max-w-[10rem] text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({
  children,
  className,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      {...rest}
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      {children}
    </a>
  );
};
