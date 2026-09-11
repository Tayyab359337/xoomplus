"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useAnimation } from "@/components/animations/AnimationProvider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  animatePreloaderProgress,
  createPreloaderTimeline,
  playPreloaderExit,
  PRELOADER_MAX_MS,
  PRELOADER_MIN_MS,
} from "@/lib/animations";

import styles from "./preloader.module.css";

/**
 * Premium first-load preloader.
 * Visual transition only — does not gate HTML parsing or LCP.
 * Exits as soon as the document is interactive (with a short polish floor).
 */
export function Preloader() {
  const reduceMotion = usePrefersReducedMotion();
  const { preloaderDone, setPreloaderDone } = useAnimation();
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useGSAP(
    () => {
      if (reduceMotion || preloaderDone || started.current) return;
      if (
        !rootRef.current ||
        !markRef.current ||
        !fillRef.current ||
        !labelRef.current
      ) {
        return;
      }

      started.current = true;
      const startedAt = performance.now();
      let ready = false;
      let finished = false;
      let progress = 0;

      const els = {
        root: rootRef.current,
        mark: markRef.current,
        tagline: taglineRef.current,
        progressFill: fillRef.current,
        progressLabel: labelRef.current,
      };

      createPreloaderTimeline(els);

      const tickProgress = (target: number) => {
        progress = Math.max(progress, target);
        animatePreloaderProgress(els.progressFill, els.progressLabel, progress);
      };

      const tryFinish = async () => {
        if (finished || !ready) return;
        finished = true;

        const elapsed = performance.now() - startedAt;
        const wait = Math.max(0, PRELOADER_MIN_MS - elapsed);
        if (wait > 0) {
          await new Promise((r) => setTimeout(r, wait));
        }

        tickProgress(1);
        await playPreloaderExit(els);
        setPreloaderDone(true);
      };

      const markReady = () => {
        if (ready) return;
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
          if (!finished) tickProgress(0.85);
        });
      }

      return () => {
        window.clearTimeout(maxTimer);
        window.clearTimeout(soft);
        window.clearTimeout(soft2);
      };
    },
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
