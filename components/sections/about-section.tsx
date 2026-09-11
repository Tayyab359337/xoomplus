"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { ScrollItem } from "@/components/scroll";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
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
 * GSAP data-animate for scroll reveals; pointer tilt on fine pointers only.
 */
export function AboutSection({ className }: AboutSectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!canUsePointerTilt(reduceMotion) || !frameRef.current) return;

      const rect = frameRef.current.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setTilt({
          x: -(py * TILT_MAX),
          y: px * TILT_MAX,
        });
      });
    },
    [reduceMotion],
  );

  const onPointerLeave = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <section
      id="studio"
      aria-labelledby="about-heading"
      className={cn(styles.section, className)}
    >
      <div className={styles.grid}>
        <aside className={styles.aside}>
          <div aria-hidden className={styles.accentRail} />

          <SectionEyebrow
            number={aboutContent.index}
            data-animate="fade-up"
            className={styles.eyebrow}
          >
            {aboutContent.eyebrow}
          </SectionEyebrow>

          <p
            data-animate="fade-up"
            data-animate-delay="0.06"
            className={styles.intro}
          >
            {aboutContent.intro}
          </p>

          <div
            data-animate="fade-up"
            data-animate-delay="0.12"
            className={styles.ctaReveal}
          >
            <Link href={aboutContent.cta.href} className={styles.cta}>
              <span>{aboutContent.cta.label}</span>
              <span aria-hidden className={styles.ctaArrow}>
                →
              </span>
            </Link>
          </div>

          <div data-animate="stagger" className={styles.metaRow}>
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
            data-animate="fade-up"
            data-animate-delay="0.04"
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

          <p
            data-animate="fade-up"
            data-animate-delay="0.1"
            className={styles.body}
          >
            {aboutContent.body}
          </p>

          {aboutContent.image ? (
            <div
              data-animate="image-reveal"
              data-animate-delay="0.14"
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
                    style={{
                      transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    }}
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
