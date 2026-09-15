"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

import { AppLink } from "@/components/ui/app-link";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 100;

/** Fast open/close — no spring lag */
const transition = {
  duration: 0.08,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

type MenuHoverApi = {
  clearLeaveTimer: () => void;
  scheduleClose: () => void;
  registerPanel: (el: HTMLElement | null) => void;
};

const MenuHoverContext = createContext<MenuHoverApi | null>(null);

/**
 * Mega panel must portal to document.body.
 * NavBody always sets Framer `backdropFilter` (even blur(0)), which creates a
 * filter root — nested backdrop-filter then only samples inside the nav, not
 * the page, so frost looks like a flat opaque fill.
 */
export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  className,
  triggerClassName,
  panelClassName,
  matchNavWidth = false,
  href,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  /** Optional width/padding overrides for the dropdown panel */
  panelClassName?: string;
  /** Lock panel width to the sticky NavBody bar */
  matchNavWidth?: boolean;
  href?: string;
}) => {
  const hover = useContext(MenuHoverContext);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const [panelWidth, setPanelWidth] = useState<number | null>(null);
  const open = active !== null && active === item;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const update = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const navRoot = trigger.closest<HTMLElement>("[data-nav-entrance]");
      // NavBody is the sticky bar (animated width); outer wrapper is full viewport
      const navBar = (navRoot?.firstElementChild as HTMLElement | null) ?? navRoot;
      const rect = (navBar ?? trigger).getBoundingClientRect();
      setPanelTop(Math.round(rect.bottom + 10));
      if (matchNavWidth) {
        // Prefer a roomy mega panel — at least ~72rem when viewport allows
        const navW = Math.round(rect.width);
        const roomy = Math.min(window.innerWidth - 24, 1180);
        setPanelWidth(Math.max(navW, roomy));
      }
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, matchNavWidth]);

  const panel = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key={item}
          ref={(el) => {
            // Never register null — sibling MenuItems / ref identity churn
            // was clearing the open panel and making the first click look "outside".
            if (el) hover?.registerPanel(el);
          }}
          role="region"
          aria-label={item}
          data-mega-menu-panel=""
          initial={{ opacity: 0, scale: 0.99, y: 3, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.99, y: 2, x: "-50%" }}
          transition={transition}
          onMouseEnter={() => hover?.clearLeaveTimer()}
          onMouseLeave={() => hover?.scheduleClose()}
          onPointerDown={(event) => {
            // Keep document outside-click from seeing panel interactions
            event.stopPropagation();
          }}
          className={cn(
            "fixed left-1/2 z-[100] max-h-[min(86vh,52rem)] overflow-y-auto overflow-x-hidden rounded-[1.75rem] border border-border/60 shadow-xl",
            "bg-white dark:bg-background",
            panelClassName,
          )}
          style={{
            top: panelTop,
            width: matchNavWidth && panelWidth ? panelWidth : undefined,
            maxWidth: matchNavWidth ? "calc(100vw - 1.5rem)" : undefined,
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setActive(item)}
      className={cn("relative z-20", className)}
    >
      {href ? (
        <AppLink
          href={href}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 text-foreground/70 transition-colors hover:text-foreground",
            triggerClassName,
          )}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span>{item}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 shrink-0 opacity-70 transition-transform duration-200 ease-out",
              open && "rotate-180",
            )}
          />
        </AppLink>
      ) : (
        <button
          type="button"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 text-foreground/70 transition-colors hover:text-foreground",
            triggerClassName,
          )}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span>{item}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 shrink-0 opacity-70 transition-transform duration-200 ease-out",
              open && "rotate-180",
            )}
          />
        </button>
      )}
      {mounted ? createPortal(panel, document.body) : null}
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
  const panelRef = useRef<HTMLElement | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const [backdropMounted, setBackdropMounted] = useState(false);
  const [backdropTop, setBackdropTop] = useState(0);

  useEffect(() => {
    setBackdropMounted(true);
  }, []);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearLeaveTimer();
    setActive(null);
    panelRef.current = null;
  }, [clearLeaveTimer, setActive]);

  const scheduleClose = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setActive(null);
      panelRef.current = null;
      leaveTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, [clearLeaveTimer, setActive]);

  const registerPanel = useCallback((el: HTMLElement | null) => {
    if (el) panelRef.current = el;
  }, []);

  const hoverApi = useMemo(
    () => ({ clearLeaveTimer, scheduleClose, registerPanel }),
    [clearLeaveTimer, scheduleClose, registerPanel],
  );

  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close on route change only
  }, [pathname]);

  /* Keep blur below the sticky nav so the bar stays sharp and hoverable */
  useLayoutEffect(() => {
    if (active === null) return;

    const update = () => {
      const navRoot = document.querySelector<HTMLElement>("[data-nav-entrance]");
      const navBar =
        (navRoot?.firstElementChild as HTMLElement | null) ?? navRoot;
      const bottom = navBar
        ? Math.round(navBar.getBoundingClientRect().bottom)
        : 72;
      setBackdropTop(Math.max(0, bottom));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active]);

  useEffect(() => {
    if (active === null) {
      panelRef.current = null;
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      const inPanel =
        path.some(
          (node) =>
            node instanceof Element && node.hasAttribute("data-mega-menu-panel"),
        ) || Boolean(panelRef.current?.contains(target));
      const inTrigger = Boolean(rootRef.current?.contains(target));

      if (!inTrigger && !inPanel) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [active, close]);

  useEffect(() => () => clearLeaveTimer(), [clearLeaveTimer]);

  const backdrop = (
    <AnimatePresence>
      {active !== null ? (
        <motion.div
          key="mega-menu-backdrop"
          aria-hidden
          data-mega-menu-backdrop=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            /* Under nav (z-50), above page; no pointer events so hover-leave closes */
            "pointer-events-none fixed inset-x-0 bottom-0 z-[40]",
            "bg-background/40 dark:bg-background/50",
            "supports-[backdrop-filter]:bg-background/25 supports-[backdrop-filter]:dark:bg-background/35",
          )}
          style={{
            top: backdropTop,
            WebkitBackdropFilter: "blur(16px) saturate(1.45)",
            backdropFilter: "blur(16px) saturate(1.45)",
          }}
        />
      ) : null}
    </AnimatePresence>
  );

  return (
    <MenuHoverContext.Provider value={hoverApi}>
      <div
        ref={rootRef}
        onMouseEnter={clearLeaveTimer}
        onMouseLeave={scheduleClose}
        className={cn("relative flex items-center", className)}
      >
        {children}
      </div>
      {backdropMounted ? createPortal(backdrop, document.body) : null}
    </MenuHoverContext.Provider>
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
    <AppLink href={href} className="flex max-w-[16rem] space-x-2">
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
    </AppLink>
  );
};

export const HoveredLink = ({
  children,
  className,
  href = "#",
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <AppLink
      {...rest}
      href={href}
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      {children}
    </AppLink>
  );
};
