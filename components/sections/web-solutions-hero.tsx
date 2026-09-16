"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";

import { AntigravityBackground } from "@/components/effects/antigravity-background";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { EASE_OUT_EXPO, gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/animations";
import type { WebSolutionsHeroCopy } from "@/lib/data/web-solutions";

import styles from "./web-solutions-hero.module.css";

export function WebSolutionsHero({ copy }: { copy: WebSolutionsHeroCopy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const compact = useMediaQuery("(max-width: 768px)");

  useGSAP(() => {
    const hero = sectionRef.current;
    if (!hero || reduceMotion) return;
    registerGsapPlugins();
    const targets = hero.querySelectorAll<HTMLElement>("[data-web-reveal]");
    const intro = gsap.from(targets, { y: 12, opacity: 0, duration: 0.7, stagger: 0.08, ease: EASE_OUT_EXPO, clearProps: "transform,opacity" });
    if (compact) return () => intro.kill();
    const scroll = ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", scrub: true, animation: gsap.to(hero.querySelector("[data-web-title]"), { y: -24, ease: "none" }) });
    return () => { scroll.kill(); intro.kill(); };
  }, { dependencies: [reduceMotion, compact], scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Web Solutions">
      <AntigravityBackground />
      <div className={styles.veil} aria-hidden />
      <div className={styles.shell}>
        <div className={styles.stack}>
          <div className={styles.frost} aria-hidden />
          <div data-web-reveal className={styles.badge}><Link href="/" className={styles.home}>Home</Link><span>{copy.eyebrow}</span></div>
          <h1 data-web-reveal data-web-title className={styles.title}>{copy.headline}</h1>
          <p data-web-reveal className={styles.body}>{copy.body}</p>
          <a data-web-reveal href="#sub-services" className="btn-primary">Explore Services <span aria-hidden>↓</span></a>
        </div>
      </div>
    </section>
  );
}
