"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useGSAP } from "@gsap/react";

import Magnet from "@/components/ui/magnet";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { DUR_HOVER, EASE, gsap, registerGsapPlugins } from "@/lib/animations";
import { aboutContent } from "@/lib/data/homepage";
import type { HomepageAbout } from "@/lib/wordpress/types";
import { cn } from "@/lib/utils";

import styles from "./about-section.module.css";

type AboutSectionProps = {
  className?: string;
  content?: HomepageAbout;
};

const TILT_MAX = 3.5;
const FINE_POINTER_MQ = "(pointer: fine) and (hover: hover)";

function canUsePointerTilt(reduceMotion: boolean): boolean {
  if (reduceMotion || typeof window === "undefined") return false;
  return window.matchMedia(FINE_POINTER_MQ).matches;
}

/**
 * About — media + copy: eyebrow/statement sit directly above body text.
 */
export function AboutSection({ className, content }: AboutSectionProps) {
  const about = content ?? aboutContent;
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
      <div className={styles.shell}>
        <div className={styles.panel}>
          {about.image ? (
            <div data-animate="image-reveal" className={styles.mediaCol}>
              <div className={styles.mediaScroll}>
                <div data-parallax={reduceMotion ? undefined : "14"}>
                  <div
                    ref={frameRef}
                    className={styles.mediaCard}
                    onPointerMove={onPointerMove}
                    onPointerLeave={onPointerLeave}
                  >
                    <div className={styles.mediaFrame}>
                      <Image
                        data-animate-media
                        src={about.image.src}
                        alt={about.image.alt}
                        width={800}
                        height={560}
                        sizes="(max-width: 768px) 92vw, (max-width: 1200px) 42vw, 360px"
                        className={styles.mediaImage}
                        quality={72}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.mediaMeta}>
                      <p className={styles.mediaTitle}>Studio craft</p>
                      <p className={styles.mediaDesc}>
                        Strategy · design · growth
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className={styles.copyCol}>
            <SectionEyebrow
              number={about.index}
              data-reveal
              className={styles.eyebrow}
            >
              {about.eyebrow}
            </SectionEyebrow>

            <h2 id="about-heading" data-reveal className={styles.statement}>
              {about.statementLines.map((line, i) =>
                line === "" ? (
                  <span key={`break-${i}`} className={styles.statementBreak} />
                ) : (
                  <span key={`${line}-${i}`} className={styles.statementLine}>
                    {line}
                  </span>
                ),
              )}
            </h2>

            <p data-reveal className={styles.lead}>
              {about.intro}
            </p>

            {about.body ? (
              <p data-reveal className={styles.body}>
                {about.body}
              </p>
            ) : null}

            <div data-reveal className={styles.ctaRow}>
              <Magnet padding={48} magnetStrength={3}>
                <Link href={about.cta.href} className="btn-primary">
                  {about.cta.label}
                  <span aria-hidden className="translate-y-px text-[0.95em]">
                    →
                  </span>
                </Link>
              </Magnet>
            </div>

            {about.meta.length > 0 ? (
              <ul data-reveal-stagger className={styles.metaRow}>
                {about.meta.map((item) => (
                  <li key={item.label} className={styles.metaItem}>
                    <span className={styles.metaLabel}>{item.label}</span>
                    <span className={styles.metaValue}>{item.value}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
