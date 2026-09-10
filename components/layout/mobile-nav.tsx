"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";

import styles from "./mobile-nav.module.css";

const NAV_ITEMS = [
  { name: "Work", link: "#work" },
  { name: "Approach", link: "#approach" },
  { name: "Studio", link: "#studio" },
  { name: "Contact", link: "#contact" },
];

function BrandMark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="font-display text-lg tracking-tight text-foreground"
    >
      Xoom
      <span className="text-accent">plus</span>
    </Link>
  );
}

/**
 * Mobile nav portaled to document.body so backdrop-filter isn't killed by
 * app wrappers / scroll libraries. Frost is on the bar itself (no opacity tricks).
 */
export function MobileNav() {
  const isClient = useIsClient();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 100);
  });

  useEffect(() => {
    document.body.toggleAttribute("data-mobile-nav-open", open);
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.removeAttribute("data-mobile-nav-open");
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const compact = scrolled || open;

  if (!isClient) return null;

  return createPortal(
    <div className={styles.root} data-mobile-nav="">
      <header
        className={cn(
          styles.bar,
          compact && styles.barCompact,
          compact && styles.barFrost,
          open && styles.barOpen,
        )}
      >
        <div className={styles.barRow}>
          <BrandMark onClick={close} />
          <div className={styles.actions}>
            <ThemeToggle className="size-8" />
            <button
              type="button"
              className={styles.ham}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              onClick={() => setOpen((value) => !value)}
            >
              <span
                className={styles.hamIcon}
                data-open={open ? "true" : "false"}
              >
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <div key="backdrop" className={styles.backdrop} aria-hidden />
            <button
              key="backdrop-hit"
              type="button"
              className={styles.backdropHit}
              aria-label="Close menu"
              onClick={close}
            />
            <nav
              key="panel"
              id="mobile-nav-panel"
              className={styles.panel}
              aria-label="Mobile navigation"
            >
              <ul className={styles.list}>
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.link}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.05 + index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a href={item.link} className={styles.link} onClick={close}>
                      <span className={styles.linkLabel}>{item.name}</span>
                      <span className={styles.linkIndex}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className={styles.footer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
              >
                <a href="#contact" className={styles.cta} onClick={close}>
                  Start a project
                </a>
              </motion.div>
            </nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
