"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { useIsClient } from "@/hooks/use-is-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  graphicDesignApproachCopy,
  graphicDesignApproachStages,
  type GraphicDesignApproachStage,
} from "@/lib/data/graphic-design-approach";
import { cn } from "@/lib/utils";

import styles from "./graphic-design-approach.module.css";

type GraphicDesignApproachProps = {
  className?: string;
  stages?: GraphicDesignApproachStage[];
  copy?: typeof graphicDesignApproachCopy;
};

function ApproachVisual({
  stage,
  priority = false,
}: {
  stage: GraphicDesignApproachStage;
  priority?: boolean;
}) {
  return (
    <div className={styles.visual}>
      <Image
        src={stage.image}
        alt={stage.imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 384px"
        className={styles.visualImage}
        priority={priority}
      />
    </div>
  );
}

function ApproachMobileStack({
  stages,
}: {
  stages: GraphicDesignApproachStage[];
}) {
  return (
    <ol className={styles.mobileStack}>
      {stages.map((stage, index) => (
        <li key={stage.number} className={styles.mobileItem} data-reveal>
          <div className={styles.mobileVisual}>
            <Image
              src={stage.image}
              alt={stage.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className={styles.visualImage}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
          <div className={styles.mobileMeta}>
            <p className={styles.mobileNumber}>
              {stage.number} — {stage.title}
            </p>
            <h3 className={styles.mobileTitle}>{stage.title}</h3>
            <p className={styles.mobileBody}>{stage.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Graphic Design — Our Approach.
 * Desktop: Aceternity Sticky Scroll Reveal.
 * Mobile / reduced motion: vertical editorial stack.
 */
export function GraphicDesignApproach({
  className,
  stages,
  copy,
}: GraphicDesignApproachProps) {
  const items = stages ?? graphicDesignApproachStages;
  const sectionCopy = copy ?? graphicDesignApproachCopy;
  const sectionRef = useRef<HTMLElement>(null);
  const isClient = useIsClient();
  const reduceMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const useSticky = isClient && isDesktop && !reduceMotion;

  useSectionReveal(sectionRef);

  const stickyContent = useMemo(
    () =>
      items.map((stage, index) => ({
        title: `${stage.number} — ${stage.title}`,
        description: stage.description,
        content: <ApproachVisual stage={stage} priority={index === 0} />,
      })),
    [items],
  );

  return (
    <section
      ref={sectionRef}
      id="approach"
      aria-label="Our graphic design approach"
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

        {useSticky ? (
          <div className={styles.stickyWrap} data-reveal>
            <StickyScroll content={stickyContent} />
          </div>
        ) : (
          <ApproachMobileStack stages={items} />
        )}
      </div>
    </section>
  );
}
