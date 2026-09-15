"use client";

import Link from "next/link";

import { InteractiveParticles } from "@/components/ui/interactive-particles";

import styles from "./not-found-experience.module.css";

/**
 * Minimal 404 experience — message + lightweight interactive particles.
 */
export function NotFoundExperience() {
  return (
    <main className={styles.main}>
      <div className={styles.stage} aria-hidden>
        <InteractiveParticles
          text="404"
          className={styles.particles}
          maxParticles={180}
        />
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Page not found</p>
        <h1 className={styles.title}>This page doesn’t exist.</h1>
        <p className={styles.body}>
          The link may be broken, or the page may have moved.
        </p>
        <Link href="/" className="btn-primary">
          Back to home
          <span aria-hidden className="translate-y-px text-[0.95em]">
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
