"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";

import { Timeline } from "@/components/ui/timeline";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
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

const imageShadow =
  "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05)]";

function ApproachStepContent({
  stage,
  priority = false,
}: {
  stage: GraphicDesignApproachStage;
  priority?: boolean;
}) {
  return (
    <div>
      <h4 className="mb-3 font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        {stage.title}
      </h4>
      <p className="mb-8 max-w-prose text-xs font-normal text-muted-foreground md:text-sm">
        {stage.description}
      </p>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:aspect-[16/10]">
        <Image
          src={stage.image}
          alt={stage.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className={cn("object-cover", imageShadow)}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    </div>
  );
}

/**
 * Graphic Design — Our Approach (Aceternity Timeline).
 * Intro uses section reveal; timeline itself must NOT be under GSAP transform
 * or sticky + scroll progress becomes choppy.
 */
export function GraphicDesignApproach({
  className,
  stages,
  copy,
}: GraphicDesignApproachProps) {
  const items = stages ?? graphicDesignApproachStages;
  const sectionCopy = copy ?? graphicDesignApproachCopy;
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal(sectionRef);

  const timelineData = useMemo(
    () =>
      items.map((stage, index) => ({
        title: stage.number,
        content: (
          <ApproachStepContent stage={stage} priority={index === 0} />
        ),
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
      </div>

      <div className={styles.timelineWrap}>
        <Timeline data={timelineData} />
      </div>
    </section>
  );
}
