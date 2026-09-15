"use client";

import { useRef } from "react";

import { WhyUsBento, type WhyUsBentoItem } from "@/components/ui/why-us-bento";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  seoWhyUsAvatars,
  seoWhyUsCopy,
  seoWhyUsItems,
} from "@/lib/data/seo-why-us";
import { cn } from "@/lib/utils";

import gdStyles from "@/components/sections/graphic-design/graphic-design-why-us.module.css";

type SeoWhyUsCopy = {
  eyebrow: string;
  title: string;
  body: string;
};

type SeoWhyUsProps = {
  className?: string;
  copy?: SeoWhyUsCopy;
  items?: WhyUsBentoItem[];
  teamAvatars?: string[];
  ariaLabel?: string;
};

/**
 * Why Choose — shared WhyUsBento section used on SEO Services (and About).
 * Defaults keep the SEO Services page unchanged.
 */
export function SeoWhyUs({
  className,
  copy = seoWhyUsCopy,
  items = seoWhyUsItems,
  teamAvatars = seoWhyUsAvatars,
  ariaLabel = "Why choose Xoomplus for SEO",
}: SeoWhyUsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      aria-label={ariaLabel}
      data-section-reveal
      className={cn(gdStyles.section, className)}
    >
      <div className={gdStyles.shell}>
        <header data-reveal className={gdStyles.intro}>
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>
          <h2 className={gdStyles.title}>{copy.title}</h2>
          <p className={gdStyles.body}>{copy.body}</p>
        </header>

        <div data-reveal className={gdStyles.bento}>
          <WhyUsBento items={items} teamAvatars={teamAvatars} />
        </div>
      </div>
    </section>
  );
}
