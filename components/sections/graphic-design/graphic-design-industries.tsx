"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  ensureCursorPreview,
  featureEnabled,
  hideCursorPreview,
  moveCursorPreview,
  resolveMotionTier,
  showCursorPreview,
} from "@/lib/animations";
import {
  graphicDesignIndustries,
  graphicDesignIndustriesCopy,
  type GraphicDesignIndustry,
} from "@/lib/data/graphic-design-industries";
import { cn } from "@/lib/utils";

import styles from "./graphic-design-industries.module.css";

type GraphicDesignIndustriesProps = {
  className?: string;
  industries?: GraphicDesignIndustry[];
  copy?: typeof graphicDesignIndustriesCopy;
};

/**
 * Graphic Design — Industries We Serve.
 * Editorial numbered list; desktop reuses shared cursor-preview.
 */
export function GraphicDesignIndustries({
  className,
  industries,
  copy,
}: GraphicDesignIndustriesProps) {
  const items = industries ?? graphicDesignIndustries;
  const sectionCopy = copy ?? graphicDesignIndustriesCopy;
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeIndex, setActiveIndex] = useState(0);

  useSectionReveal(sectionRef);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list || reduceMotion || !isDesktop) return;

      const tier = resolveMotionTier({ reducedMotion: reduceMotion });
      if (!featureEnabled("cursorPreview", tier)) return;

      const preview = ensureCursorPreview();
      const rows = Array.from(
        list.querySelectorAll<HTMLElement>("[data-industry-row]"),
      );
      const cleanups: Array<() => void> = [];

      for (const row of rows) {
        const src = row.dataset.previewSrc;
        if (!src) continue;

        const onEnter = (event: PointerEvent) => {
          showCursorPreview(preview, src, event);
        };
        const onMove = (event: PointerEvent) => {
          moveCursorPreview(preview, event);
        };
        const onLeave = () => {
          hideCursorPreview(preview);
        };

        row.addEventListener("pointerenter", onEnter);
        row.addEventListener("pointermove", onMove);
        row.addEventListener("pointerleave", onLeave);

        cleanups.push(() => {
          row.removeEventListener("pointerenter", onEnter);
          row.removeEventListener("pointermove", onMove);
          row.removeEventListener("pointerleave", onLeave);
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
        hideCursorPreview(preview);
      };
    },
    { dependencies: [isDesktop, reduceMotion, items], scope: listRef },
  );

  return (
    <section
      ref={sectionRef}
      id="industries"
      aria-label="Industries we serve"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <header data-reveal className={styles.intro}>
          <SectionEyebrow className={styles.eyebrow}>
            {sectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{sectionCopy.title}</h2>
          <p className={styles.body}>{sectionCopy.body}</p>
        </header>

        <ul ref={listRef} className={styles.list} data-reveal-stagger>
          {items.map((industry, index) => (
            <li
              key={industry.number}
              className={styles.item}
              data-accent={industry.accent}
              data-active={activeIndex === index ? "true" : "false"}
            >
              <button
                type="button"
                className={styles.row}
                data-industry-row
                data-preview-src={industry.image}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                aria-label={`${industry.number} ${industry.name}`}
              >
                <p className={styles.number}>{industry.number}</p>
                <div>
                  <h3 className={styles.name}>{industry.name}</h3>
                  <p className={styles.copy}>{industry.description}</p>
                  {!isDesktop ? (
                    <div className={styles.mobileVisual}>
                      <Image
                        src={industry.image}
                        alt={industry.imageAlt}
                        fill
                        sizes="(max-width: 1023px) 100vw, 0px"
                        className={styles.mobileImage}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ) : null}
                </div>
                <span className={styles.arrow} aria-hidden>
                  <ArrowUpRight className="size-5" strokeWidth={1.6} />
                </span>
                <span className={styles.accent} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
