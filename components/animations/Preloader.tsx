"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";

import { useAnimation } from "@/components/animations/AnimationProvider";
import { useSmoothScroll } from "@/components/providers/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  createPreloaderController,
  PRELOADER_MAX_MS,
  PRELOADER_MIN_MS,
} from "@/lib/animations";

import styles from "./preloader.module.css";

/**
 * Premium first-load preloader — zoom-through reveal on exit.
 * Visual transition only — does not gate HTML parsing or LCP.
 * Locks body/Lenis scroll while active; unmounts on exit complete.
 */
export function Preloader() {
  const reduceMotion = usePrefersReducedMotion();
  const { preloaderDone, setPreloaderDone } = useAnimation();
  const { stop, start } = useSmoothScroll();
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const stopRef = useRef(stop);
  const startRef = useRef(start);
  const prevHtmlOverflow = useRef("");
  const prevBodyOverflow = useRef("");

  useEffect(() => {
    stopRef.current = stop;
    startRef.current = start;
  }, [stop, start]);

  const lockScroll = () => {
    prevHtmlOverflow.current = document.documentElement.style.overflow;
    prevBodyOverflow.current = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    stopRef.current();
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = prevHtmlOverflow.current;
    document.body.style.overflow = prevBodyOverflow.current;
    startRef.current();
  };

  useGSAP(
    () => {
      if (reduceMotion || preloaderDone) return;
      if (
        !rootRef.current ||
        !markRef.current ||
        !fillRef.current ||
        !labelRef.current
      ) {
        return;
      }

      let cancelled = false;
      lockScroll();

      const startedAt = performance.now();
      let ready = false;
      let finished = false;
      let progress = 0;

      const controller = createPreloaderController({
        root: rootRef.current,
        mark: markRef.current,
        tagline: taglineRef.current,
        progressFill: fillRef.current,
        progressLabel: labelRef.current,
      });

      const tickProgress = (target: number) => {
        if (cancelled) return;
        progress = Math.max(progress, target);
        controller.setProgress(progress);
      };

      const tryFinish = async () => {
        if (cancelled || finished || !ready) return;
        finished = true;

        const elapsed = performance.now() - startedAt;
        const wait = Math.max(0, PRELOADER_MIN_MS - elapsed);
        if (wait > 0) {
          await new Promise((r) => setTimeout(r, wait));
        }
        if (cancelled) return;

        tickProgress(1);
        await controller.playExit();
        if (cancelled) return;

        unlockScroll();
        setPreloaderDone(true);
      };

      const markReady = () => {
        if (cancelled || ready) return;
        ready = true;
        tickProgress(0.92);
        void tryFinish();
      };

      tickProgress(0.18);
      const soft = window.setTimeout(() => tickProgress(0.45), 180);
      const soft2 = window.setTimeout(() => tickProgress(0.7), 400);
      const maxTimer = window.setTimeout(markReady, PRELOADER_MAX_MS);

      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        window.setTimeout(markReady, 100);
      } else {
        document.addEventListener(
          "DOMContentLoaded",
          () => {
            window.setTimeout(markReady, 80);
          },
          { once: true },
        );
      }

      if (document.fonts?.ready) {
        void document.fonts.ready.then(() => {
          if (!cancelled && !finished) tickProgress(0.85);
        });
      }

      return () => {
        cancelled = true;
        window.clearTimeout(maxTimer);
        window.clearTimeout(soft);
        window.clearTimeout(soft2);
        controller.kill();
        unlockScroll();
      };
    },
    // stop/start held in refs so Strict Mode / Lenis remounts don't re-kill the run
    { dependencies: [reduceMotion, preloaderDone, setPreloaderDone] },
  );

  if (reduceMotion || preloaderDone) return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      role="status"
      aria-live="polite"
      aria-label="Loading Xoomplus"
    >
      <div className={styles.inner}>
        <p ref={markRef} className={styles.mark}>
          Xoom<span className={styles.accent}>plus</span>
        </p>
        <p ref={taglineRef} className={styles.tagline}>
          Digital growth partner
        </p>

        <div className={styles.progress}>
          <span className={styles.track} aria-hidden>
            <span ref={fillRef} className={styles.fill} />
          </span>
          <span ref={labelRef} className={styles.label}>
            000
          </span>
        </div>
      </div>
    </div>
  );
}
