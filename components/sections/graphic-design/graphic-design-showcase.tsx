"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";

import Magnet from "@/components/ui/magnet";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useIsClient } from "@/hooks/use-is-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { registerGsapPlugins, ScrollTrigger } from "@/lib/animations";
import {
  graphicDesignShowcaseCopy,
  graphicDesignShowcaseImages,
} from "@/lib/data/graphic-design-showcase";
import { cn } from "@/lib/utils";

import styles from "./graphic-design-showcase.module.css";

const FlyingPosters = dynamic(
  () => import("@/components/effects/flying-posters"),
  {
    ssr: false,
    loading: () => null,
  },
);

type PostersApi = {
  setScrollProgress: (progress: number) => void;
  getScrollRange: () => number;
} | null;

type GraphicDesignShowcaseProps = {
  className?: string;
  images?: string[];
  copy?: typeof graphicDesignShowcaseCopy;
};

function canUseFlyingPosters(): boolean {
  if (typeof window === "undefined") return false;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const compact = window.matchMedia("(max-width: 768px)").matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  // Prefer static strip on mobile / touch — lower JS + GPU cost
  if (compact || coarse) return false;
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  return true;
}

/**
 * Graphic Design showcase — full-viewport sticky runway.
 * Page scroll drives Flying Posters through the gallery, then releases.
 */
export function GraphicDesignShowcase({
  className,
  images,
  copy,
}: GraphicDesignShowcaseProps) {
  const posters = images ?? graphicDesignShowcaseImages;
  const sectionCopy = copy ?? graphicDesignShowcaseCopy;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const postersApiRef = useRef<PostersApi>(null);
  const reduceMotion = usePrefersReducedMotion();
  const isClient = useIsClient();
  const isCompact = useMediaQuery("(max-width: 768px)");
  const allowPosters = isClient && !reduceMotion && canUseFlyingPosters();

  const posterItems = useMemo(() => posters, [posters]);

  const onPostersReady = useCallback((api: PostersApi) => {
    postersApiRef.current = api;
    if (api && trackRef.current) {
      const trigger = ScrollTrigger.getAll().find(
        (st) => st.trigger === trackRef.current,
      );
      if (trigger) api.setScrollProgress(trigger.progress);
    }
  }, []);

  useSectionReveal(sectionRef);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || !allowPosters) return;

      registerGsapPlugins();

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          postersApiRef.current?.setScrollProgress(self.progress);
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { dependencies: [allowPosters], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-label="Selected graphic design work"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div
        ref={trackRef}
        className={cn(styles.track, !allowPosters && styles.trackStatic)}
      >
        <div className={styles.pin}>
          <div className={styles.shell}>
            <div className={styles.stage} aria-hidden={allowPosters}>
              {allowPosters ? (
                <FlyingPosters
                  items={posterItems as never[]}
                  planeWidth={isCompact ? 260 : 340}
                  planeHeight={isCompact ? 340 : 460}
                  distortion={isCompact ? 1.8 : 2.6}
                  scrollEase={0.12}
                  cameraFov={isCompact ? 48 : 42}
                  cameraZ={isCompact ? 16 : 18}
                  externalControl
                  onReady={onPostersReady}
                  className={styles.posters}
                />
              ) : (
                <div className={styles.fallback} role="list">
                  {posterItems.slice(0, 5).map((src) => (
                    <figure
                      key={src}
                      className={styles.fallbackFigure}
                      role="listitem"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 60vw, 220px"
                        className={styles.fallbackImage}
                      />
                    </figure>
                  ))}
                </div>
              )}
            </div>

            <header data-reveal className={styles.intro}>
              <SectionEyebrow className={styles.eyebrow}>
                {sectionCopy.eyebrow}
              </SectionEyebrow>
              <h2 className={styles.title}>{sectionCopy.title}</h2>
              <p className={styles.body}>{sectionCopy.body}</p>
            </header>

            <div data-reveal className={styles.footer}>
              {allowPosters ? (
                <p className={styles.hint}>Keep scrolling through the gallery</p>
              ) : null}
              <div className={styles.ctaWrap}>
                <Magnet padding={50} magnetStrength={3}>
                  <Link
                    href={sectionCopy.cta.href}
                    className={cn("btn-ghost", styles.cta)}
                  >
                    {sectionCopy.cta.label}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </Link>
                </Magnet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
