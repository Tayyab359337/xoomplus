"use client";

import { useRef } from "react";

import { WhyUsBento } from "@/components/ui/why-us-bento";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  seoWhyUsAvatars,
  seoWhyUsCopy,
  seoWhyUsItems,
} from "@/lib/data/seo-why-us";
import { cn } from "@/lib/utils";

import gdStyles from "@/components/sections/graphic-design/graphic-design-why-us.module.css";

type SeoWhyUsProps = {
  className?: string;
};

/**
 * SEO Services — Why Choose XoomPlus.
 * Same WhyUsBento layout as Graphic Design; copy is from WordPress page 3062.
 */
export function SeoWhyUs({ className }: SeoWhyUsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      aria-label="Why choose Xoomplus for SEO"
      data-section-reveal
      className={cn(gdStyles.section, className)}
    >
      <div className={gdStyles.shell}>
        <header data-reveal className={gdStyles.intro}>
          <SectionEyebrow>{seoWhyUsCopy.eyebrow}</SectionEyebrow>
          <h2 className={gdStyles.title}>{seoWhyUsCopy.title}</h2>
          <p className={gdStyles.body}>{seoWhyUsCopy.body}</p>
        </header>

        <div data-reveal className={gdStyles.bento}>
          <WhyUsBento items={seoWhyUsItems} teamAvatars={seoWhyUsAvatars} />
        </div>
      </div>
    </section>
  );
}
