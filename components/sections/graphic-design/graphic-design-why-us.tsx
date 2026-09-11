"use client";

import { useRef } from "react";

import { WhyUsBento } from "@/components/ui/why-us-bento";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  graphicDesignWhyUsAvatars,
  graphicDesignWhyUsCopy,
  graphicDesignWhyUsItems,
} from "@/lib/data/graphic-design-why-us";
import { cn } from "@/lib/utils";

import styles from "./graphic-design-why-us.module.css";

type GraphicDesignWhyUsProps = {
  className?: string;
};

/**
 * Graphic Design — Why Choose Us.
 * Wraps the adapted Vengeance WhyUsBento with Xoomplus intro + reveal.
 */
export function GraphicDesignWhyUs({ className }: GraphicDesignWhyUsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      aria-label="Why choose Xoomplus for graphic design"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <header data-reveal className={styles.intro}>
          <SectionEyebrow>{graphicDesignWhyUsCopy.eyebrow}</SectionEyebrow>
          <h2 className={styles.title}>{graphicDesignWhyUsCopy.title}</h2>
          <p className={styles.body}>{graphicDesignWhyUsCopy.body}</p>
        </header>

        <div data-reveal className={styles.bento}>
          <WhyUsBento
            items={graphicDesignWhyUsItems}
            teamAvatars={graphicDesignWhyUsAvatars}
          />
        </div>
      </div>
    </section>
  );
}
