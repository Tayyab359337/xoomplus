"use client";

import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";

import Magnet from "@/components/ui/magnet";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  graphicDesignShowcaseCopy,
  graphicDesignShowcaseImages,
} from "@/lib/data/graphic-design-showcase";
import { cn } from "@/lib/utils";

import styles from "./graphic-design-showcase.module.css";

const DomeGallery = dynamic(
  () => import("@/components/DomeGallery"),
  {
    ssr: false,
    loading: () => null,
  },
);

type GraphicDesignShowcaseProps = {
  className?: string;
  images?: string[];
  copy?: typeof graphicDesignShowcaseCopy;
};

/**
 * Showcase intro (copy) + interactive DomeGallery of selected design work.
 */
export function GraphicDesignShowcase({
  className,
  images,
  copy,
}: GraphicDesignShowcaseProps) {
  const posters = images ?? graphicDesignShowcaseImages;
  const sectionCopy = copy ?? graphicDesignShowcaseCopy;
  const introRef = useRef<HTMLElement>(null);

  useSectionReveal(introRef);

  const galleryImages = posters.map((src, index) => ({
    src,
    alt: `Selected graphic design work ${index + 1}`,
  }));

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

      {/* 2 — DomeGallery selected work */}
      <section
        id="showcase-gallery"
        aria-label="Design gallery"
        className={styles.gallerySection}
      >
        <div className={styles.domeCanvas}>
          <DomeGallery
            images={galleryImages}
            fit={0.8}
            minRadius={800}
            maxVerticalRotationDeg={20}
            segments={34}
            dragDampening={0.8}
            overlayBlurColor="color-mix(in srgb, var(--background) 88%, var(--primary) 12%)"
            grayscale={false}
          />
        </div>
      </section>
    </div>
  );
}
