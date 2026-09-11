"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [mountPosters, setMountPosters] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  const posterItems = useMemo(() => posters, [posters]);
  const showPosters = allowPosters && mountPosters && !webglFailed;

  const onPostersReady = useCallback((api: PostersApi) => {
    postersApiRef.current = api;
    if (!api) {
      setWebglFailed(true);
      return;
    }
    if (trackRef.current) {
      const trigger = ScrollTrigger.getAll().find(
        (st) => st.trigger === trackRef.current,
      );
      if (trigger) api.setScrollProgress(trigger.progress);
    }
  }, []);

  useSectionReveal(introRef);

  // Mount WebGL only near the gallery — avoids mobile main-thread lock on first paint
  useEffect(() => {
    if (!allowPosters) return;
    const track = trackRef.current;
    if (!track) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMountPosters(true);
          io.disconnect();
        }
      },
      { rootMargin: "180px 0px", threshold: 0.01 },
    );

    io.observe(track);
    return () => io.disconnect();
  }, [allowPosters]);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || !showPosters) return;

      registerGsapPlugins();

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: isCompact ? 0.65 : 0.45,
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

      {/* 2 — Flying Posters only (no text overlays) */}
      <section
        ref={galleryRef}
        id="showcase-gallery"
        aria-label="Design gallery"
        className={styles.gallerySection}
      >
        <div
          ref={trackRef}
          className={cn(styles.track, !allowPosters && styles.trackStatic)}
        >
          <div className={styles.pin}>
            <div className={styles.stage}>
              {showPosters ? (
                <FlyingPosters
                  items={posterItems as never[]}
                  planeWidth={isCompact ? 200 : 340}
                  planeHeight={isCompact ? 280 : 460}
                  distortion={isCompact ? 1.35 : 2.6}
                  scrollEase={isCompact ? 0.2 : 0.12}
                  cameraFov={isCompact ? 52 : 42}
                  cameraZ={isCompact ? 18 : 18}
                  quality={isCompact ? "low" : "high"}
                  externalControl
                  onReady={onPostersReady}
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
