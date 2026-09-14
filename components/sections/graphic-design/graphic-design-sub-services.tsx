"use client";

import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  DUR_HOVER,
  DUR_HOVER_OUT,
  EASE,
  EASE_SOFT,
  gsap,
  registerGsapPlugins,
} from "@/lib/animations";
import {
  graphicDesignSubServices,
  graphicDesignSubServicesCopy,
  type GraphicDesignSubService,
} from "@/lib/data/graphic-design-sub-services";
import type { GraphicDesignServicesIntro } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

import { GraphicDesignSubServicesCarousel } from "./graphic-design-sub-services-carousel";
import styles from "./graphic-design-sub-services.module.css";

type GraphicDesignSubServicesProps = {
  className?: string;
  services?: GraphicDesignSubService[];
  copy?: GraphicDesignServicesIntro;
};

const FINE_HOVER_MQ = "(hover: hover) and (pointer: fine)";

/**
 * Graphic Design sub-services —
 * Desktop: left list scrolls, right media sticky.
 * Mobile: snap carousel with arrows + dots.
 */
export function GraphicDesignSubServices({
  className,
  services,
  copy,
}: GraphicDesignSubServicesProps) {
  const items = services ?? graphicDesignSubServices;
  const sectionCopy = copy ?? graphicDesignSubServicesCopy;
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const canHover = useMediaQuery(FINE_HOVER_MQ);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = items[activeIndex] ?? items[0];

  useSectionReveal(sectionRef);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list || reduceMotion || !canHover) return;

      registerGsapPlugins();

      const rows = Array.from(
        list.querySelectorAll<HTMLElement>("[data-sub-row]"),
      );
      const cleanups: Array<() => void> = [];

      for (const row of rows) {
        const title = row.querySelector<HTMLElement>("[data-sub-title]");
        const arrow = row.querySelector<HTMLElement>("[data-sub-arrow]");

        const titleX = title
          ? gsap.quickTo(title, "x", { duration: DUR_HOVER, ease: EASE })
          : null;
        const arrowX = arrow
          ? gsap.quickTo(arrow, "x", { duration: DUR_HOVER, ease: EASE })
          : null;
        const arrowY = arrow
          ? gsap.quickTo(arrow, "y", { duration: DUR_HOVER, ease: EASE })
          : null;

        const onEnter = () => {
          titleX?.(6);
          arrowX?.(4);
          arrowY?.(-3);
        };

        const onLeave = () => {
          if (title) {
            gsap.to(title, {
              x: 0,
              duration: DUR_HOVER_OUT,
              ease: EASE_SOFT,
              overwrite: "auto",
            });
          }
          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              y: 0,
              duration: DUR_HOVER_OUT,
              ease: EASE_SOFT,
              overwrite: "auto",
            });
          }
        };

        row.addEventListener("pointerenter", onEnter);
        row.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          row.removeEventListener("pointerenter", onEnter);
          row.removeEventListener("pointerleave", onLeave);
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
      };
    },
    { dependencies: [reduceMotion, canHover, items.length], scope: sectionRef },
  );

  useGSAP(
    () => {
      const preview = previewRef.current;
      if (!preview || reduceMotion) return;

      registerGsapPlugins();
      gsap.fromTo(
        preview,
        { opacity: 0.55, scale: 1.03 },
        {
          opacity: 1,
          scale: 1,
          duration: DUR_HOVER,
          ease: EASE,
          overwrite: "auto",
        },
      );
    },
    { dependencies: [activeIndex, reduceMotion] },
  );

  const selectIndex = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const onRowActivate = useCallback(
    (index: number) => {
      if (canHover) {
        selectIndex(index);
        return;
      }
      setActiveIndex((prev) => (prev === index ? prev : index));
    },
    [canHover, selectIndex],
  );

  const onRowKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onRowActivate(index);
      }
    },
    [onRowActivate],
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      aria-label="Graphic design capabilities"
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

        <GraphicDesignSubServicesCarousel services={items} />

        <div className={styles.split}>
          <ul
            ref={listRef}
            data-reveal-stagger
            className={styles.list}
            role="list"
          >
            {items.map((service, index) => {
              const isActive = activeIndex === index;
              const number = String(index + 1).padStart(2, "0");

              return (
                <li
                  key={service.slug}
                  className={cn(styles.item, isActive && styles.itemActive)}
                >
                  <div
                    data-sub-row
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    className={styles.row}
                    onClick={() => onRowActivate(index)}
                    onMouseEnter={() => {
                      if (canHover) selectIndex(index);
                    }}
                    onFocus={() => selectIndex(index)}
                    onKeyDown={(event) => onRowKeyDown(event, index)}
                  >
                    <div className={styles.meta}>
                      <div className={styles.metaTop}>
                        <span className={styles.index}>{number}</span>
                        <span className={styles.category}>
                          {service.category}
                        </span>
                      </div>

                      <div className={styles.titleRow}>
                        <h3 data-sub-title className={styles.serviceTitle}>
                          {service.title}
                        </h3>
                        <span
                          data-sub-arrow
                          aria-hidden
                          className={styles.arrow}
                        >
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>

                      <div className={styles.description}>
                        <div className={styles.descriptionInner}>
                          <p>{service.description}</p>
                          <Link
                            href={service.href}
                            className={styles.cta}
                            onClick={(event) => event.stopPropagation()}
                          >
                            Explore
                            <ArrowUpRight
                              aria-hidden
                              className={cn("size-3.5", styles.ctaIcon)}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside
            data-reveal
            className={styles.preview}
            aria-live="polite"
            aria-atomic="true"
          >
            <div ref={previewRef} className={styles.media}>
              <Image
                key={active.slug}
                src={active.image}
                alt={active.imageAlt}
                fill
                sizes="(max-width: 1200px) 40vw, 28vw"
                className={styles.image}
                priority={activeIndex === 0}
              />
            </div>
            <p className={styles.mediaCaption}>
              {String(activeIndex + 1).padStart(2, "0")} — {active.title}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
