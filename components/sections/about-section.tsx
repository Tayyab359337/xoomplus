"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useGSAP } from "@gsap/react";

import { HoverLift } from "@/components/animations/HoverLift";
import { ScrollItem } from "@/components/scroll";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { DUR_HOVER, EASE, gsap, registerGsapPlugins } from "@/lib/animations";
import { aboutContent } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

import styles from "./about-section.module.css";

type AboutSectionProps = {
  className?: string;
};

const TILT_MAX = 4.5;
const FINE_POINTER_MQ = "(pointer: fine) and (hover: hover)";

function canUsePointerTilt(reduceMotion: boolean): boolean {
  if (reduceMotion || typeof window === "undefined") return false;
  return window.matchMedia(FINE_POINTER_MQ).matches;
}

/**
 * Editorial About — asymmetric composition, display type, restrained motion.
 */
export function AboutSection({ className }: AboutSectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const rotXTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const rotYTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useSectionReveal(sectionRef);

  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!frame || !canUsePointerTilt(reduceMotion)) return;
      registerGsapPlugins();
      gsap.set(frame, { transformPerspective: 900 });
      rotXTo.current = gsap.quickTo(frame, "rotationX", {
        duration: DUR_HOVER,
        ease: EASE,
      });
      rotYTo.current = gsap.quickTo(frame, "rotationY", {
        duration: DUR_HOVER,
        ease: EASE,
      });
      return () => {
        rotXTo.current = null;
        rotYTo.current = null;
      };
    },
    { dependencies: [reduceMotion], scope: sectionRef },
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!canUsePointerTilt(reduceMotion) || !frameRef.current) return;
      const rect = frameRef.current.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotXTo.current?.(-(py * TILT_MAX));
      rotYTo.current?.(px * TILT_MAX);
    },
    [reduceMotion],
  );

  const onPointerLeave = useCallback(() => {
    rotXTo.current?.(0);
    rotYTo.current?.(0);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="studio"
      aria-labelledby="about-heading"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.grid}>
        <aside className={styles.aside}>
          <div aria-hidden className={styles.accentRail} />

          <SectionEyebrow
            number={aboutContent.index}
            data-reveal
            className={styles.eyebrow}
          >
            {aboutContent.eyebrow}
          </SectionEyebrow>

          <p data-reveal className={styles.intro}>
            {aboutContent.intro}
          </p>

          <div data-reveal className={styles.ctaReveal}>
            <HoverLift y={-2} scale={1.01} className="inline-flex">
              <Link href={aboutContent.cta.href} className={styles.cta}>
                <span>{aboutContent.cta.label}</span>
                <span aria-hidden className={styles.ctaArrow}>
                  →
                </span>
              </Link>
            </HoverLift>
          </div>

          <div data-reveal-stagger className={styles.metaRow}>
            {aboutContent.meta.map((item) => (
              <div key={item.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{item.label}</span>
                <span className={styles.metaValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className={styles.main}>
          <h2
            id="about-heading"
            data-reveal
            className={styles.statement}
          >
            {aboutContent.statementLines.map((line, i) =>
              line === "" ? (
                <span key={`break-${i}`} className={styles.statementBreak} />
              ) : (
                <span key={`${line}-${i}`} className={styles.statementLine}>
                  {line}
                </span>
              ),
            )}
          </h2>

          <p data-reveal className={styles.body}>
            {aboutContent.body}
          </p>

          {aboutContent.image ? (
            <div
              data-animate="image-reveal"
              className={styles.mediaReveal}
            >
              <ScrollItem
                speed={reduceMotion ? undefined : 0.28}
                className={styles.mediaScroll}
              >
                <div data-parallax={reduceMotion ? undefined : "18"}>
                  <div
                    ref={frameRef}
                    className={styles.mediaFrame}
                    onPointerMove={onPointerMove}
                    onPointerLeave={onPointerLeave}
                  >
                    <Image
                      data-animate-media
                      src={aboutContent.image.src}
                      alt={aboutContent.image.alt}
                      width={1400}
                      height={980}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 640px"
                      className={styles.mediaImage}
                      priority={false}
                    />
                    <span aria-hidden className={styles.mediaCaption}>
                      Studio still · 01
                    </span>
                  </div>
                </div>
              </ScrollItem>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
