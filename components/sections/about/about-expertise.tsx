"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { HoverLift } from "@/components/animations/HoverLift";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { NumberTicker } from "@/components/ui/number-ticker";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { EASE, gsap, registerGsapPlugins } from "@/lib/animations";
import {
  aboutExpertiseCopy,
  aboutExpertiseMetrics,
} from "@/lib/data/about";
import { cn } from "@/lib/utils";

import styles from "./about-expertise.module.css";

const RING_RADIUS = 46;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type AboutExpertiseProps = {
  className?: string;
};

/**
 * Our Expertise & Impact — two dominant 90% metrics, asymmetric editorial layout.
 */
export function AboutExpertise({ className }: AboutExpertiseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  useSectionReveal(sectionRef);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const rings = section.querySelectorAll<SVGCircleElement>("[data-ring-progress]");
      if (!rings.length) return;

      registerGsapPlugins();

      rings.forEach((ring) => {
        const value = Number(ring.dataset.ringValue ?? 90);
        const endOffset = RING_CIRCUMFERENCE * (1 - value / 100);
        gsap.set(ring, {
          strokeDasharray: RING_CIRCUMFERENCE,
          strokeDashoffset: RING_CIRCUMFERENCE,
        });

        if (reduceMotion) {
          gsap.set(ring, { strokeDashoffset: endOffset });
          return;
        }

        gsap.to(ring, {
          strokeDashoffset: endOffset,
          duration: 1.15,
          ease: EASE,
          scrollTrigger: {
            trigger: ring,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { dependencies: [reduceMotion], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="expertise"
      aria-labelledby="expertise-heading"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <header data-reveal className={styles.intro}>
          <SectionEyebrow>{aboutExpertiseCopy.eyebrow}</SectionEyebrow>
          <h2 id="expertise-heading" className={styles.title}>
            {aboutExpertiseCopy.title}
          </h2>
          <p className={styles.body}>{aboutExpertiseCopy.body}</p>
        </header>

        <ul data-reveal-stagger className={styles.metrics}>
          {aboutExpertiseMetrics.map((metric, index) => (
            <li
              key={metric.id}
              className={cn(styles.card, index === 1 && styles.cardShift)}
            >
              <HoverLift y={-4} scale={1.012} className={styles.cardHover}>
                <article className={styles.cardInner}>
                  <div className={styles.ringWrap} aria-hidden>
                    <svg
                      className={styles.ring}
                      viewBox="0 0 108 108"
                      focusable="false"
                    >
                      <circle
                        className={styles.ringTrack}
                        cx="54"
                        cy="54"
                        r={RING_RADIUS}
                      />
                      <circle
                        data-ring-progress
                        data-ring-value={metric.value}
                        className={styles.ringValue}
                        cx="54"
                        cy="54"
                        r={RING_RADIUS}
                      />
                    </svg>
                  </div>

                  <div className={styles.cardCopy}>
                    <p className={styles.label}>{metric.label}</p>
                    <p className={styles.value}>
                      <NumberTicker
                        value={metric.value}
                        delay={0.08 * index}
                        className={styles.ticker}
                      />
                      <span className={styles.suffix}>{metric.suffix}</span>
                    </p>
                  </div>
                </article>
              </HoverLift>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
