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
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

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
      setPanelTop(Math.round(rect.bottom + 12));
      if (matchNavWidth) {
        setPanelWidth(Math.round(rect.width));
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
          initial={{ opacity: 0, scale: 0.96, y: 8, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.96, y: 8, x: "-50%" }}
          transition={transition}
          onMouseEnter={() => hover?.clearLeaveTimer()}
          onMouseLeave={() => hover?.scheduleClose()}
          onPointerDown={(event) => {
            // Keep document outside-click from seeing panel interactions
            event.stopPropagation();
          }}
          className={cn(
            "fixed left-1/2 z-[100] max-h-[min(78vh,44rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-border/60 shadow-xl",
            // Semi-transparent fill so blur reads against page content
            "bg-background/60 dark:bg-background/55",
            "backdrop-blur-2xl backdrop-saturate-150",
            "supports-[backdrop-filter]:bg-background/50 supports-[backdrop-filter]:dark:bg-background/45",
            panelClassName,
          )}
          style={{
            top: panelTop,
            width: matchNavWidth && panelWidth ? panelWidth : undefined,
            maxWidth: matchNavWidth ? "calc(100vw - 1.5rem)" : undefined,
            WebkitBackdropFilter: "blur(28px) saturate(1.6)",
            backdropFilter: "blur(28px) saturate(1.6)",
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
      className={cn("relative", className)}
    >
      <motion.a
        href={href}
        transition={{ duration: 0.3 }}
        className={cn(
          "inline-flex cursor-pointer items-center text-foreground/70 transition-colors hover:text-foreground",
          triggerClassName,
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {item}
      </motion.a>
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

    // Capture phase so we still see the event if a child stops bubble;
    // panel itself stopPropagates in bubble — we rely on composedPath + data attr.
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [active, close]);

  useEffect(() => () => clearLeaveTimer(), [clearLeaveTimer]);

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
