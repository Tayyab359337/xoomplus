"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

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

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return false;
  return true;
}

/**
 * Showcase intro (copy) + separate Flying Posters runway (no overlapping content).
 */
export function GraphicDesignShowcase({
  className,
  images,
  copy,
}: GraphicDesignShowcaseProps) {
  const posters = images ?? graphicDesignShowcaseImages;
  const sectionCopy = copy ?? graphicDesignShowcaseCopy;
  const introRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const postersApiRef = useRef<PostersApi>(null);
  const reduceMotion = usePrefersReducedMotion();
  const isClient = useIsClient();
  const isCompact = useMediaQuery("(max-width: 768px)");
  const allowPosters = isClient && !reduceMotion && canUseFlyingPosters();
  const [initFailed, setInitFailed] = useState(false);

  const posterItems = useMemo(() => posters, [posters]);
  const showPosters = allowPosters && !initFailed;

  const onPostersReady = useCallback((api: PostersApi) => {
    // Ignore cleanup nulls — React Strict Mode remounts; that must not kill the gallery.
    if (!api) {
      postersApiRef.current = null;
      return;
    }
    postersApiRef.current = api;
    if (trackRef.current) {
      const trigger = ScrollTrigger.getAll().find(
        (st) => st.trigger === trackRef.current,
      );
      if (trigger) api.setScrollProgress(trigger.progress);
    }
  }, []);

  const onPostersError = useCallback(() => {
    setInitFailed(true);
  }, []);

  useSectionReveal(introRef);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || !showPosters) return;

      registerGsapPlugins();

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          postersApiRef.current?.setScrollProgress(self.progress);
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        trigger.kill();
      };
    },
    { dependencies: [showPosters, isCompact], scope: galleryRef },
  );

  return (
    <div className={cn(styles.wrap, className)}>
      {/* 1 — Editorial intro (no posters) */}
      <section
        ref={introRef}
        id="showcase"
        aria-label="Selected graphic design work"
        data-section-reveal
        className={styles.introSection}
      >
        <div className={styles.introShell}>
          <header data-reveal className={styles.intro}>
            <SectionEyebrow className={styles.eyebrow}>
              {sectionCopy.eyebrow}
            </SectionEyebrow>
            <h2 className={styles.title}>{sectionCopy.title}</h2>
            <p className={styles.body}>{sectionCopy.body}</p>
          </header>

          <div data-reveal className={styles.introFooter}>
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
      </section>

      {/* 2 — Flying Posters over a giant wordmark */}
      <section
        ref={galleryRef}
        id="showcase-gallery"
        aria-label="Design gallery"
        className={styles.gallerySection}
      >
        <div
          ref={trackRef}
          className={cn(styles.track, !showPosters && styles.trackStatic)}
        >
          <div className={styles.pin}>
            <div className={styles.stage}>
              <p className={styles.wordmark} aria-hidden="true">
                Designs!!!
              </p>
              {showPosters ? (
                <FlyingPosters
                  items={posterItems as never[]}
                  planeWidth={isCompact ? 200 : 340}
                  planeHeight={isCompact ? 280 : 460}
                  distortion={isCompact ? 1.35 : 2.6}
                  scrollEase={isCompact ? 0.2 : 0.12}
                  cameraFov={isCompact ? 52 : 42}
                  cameraZ={18}
                  quality={isCompact ? "low" : "high"}
                  externalControl
                  onReady={onPostersReady}
                  onError={onPostersError}
                  className={styles.posters}
                />
              ) : (
                <div className={styles.fallback} role="list">
                  {posterItems.slice(0, isCompact ? 4 : 5).map((src) => (
                    <figure
                      key={src}
                      className={styles.fallbackFigure}
                      role="listitem"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 70vw, 240px"
                        className={styles.fallbackImage}
                      />
                    </figure>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
