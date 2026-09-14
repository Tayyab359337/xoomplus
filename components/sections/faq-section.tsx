"use client";

import { useRef } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { faqItems, faqSectionCopy, type FaqItem } from "@/lib/data/faq";
import type { SectionCopy } from "@/lib/wordpress/types";
import { cn } from "@/lib/utils";

import styles from "./faq-section.module.css";

type FaqSectionProps = {
  className?: string;
  items?: FaqItem[];
  copy?: SectionCopy;
  /** @deprecated Wide intro is now the default sitewide. */
  wideCopy?: boolean;
};

/**
 * FAQ — left editorial copy, right shadcn Accordion (not full-bleed).
 * Aside title + body span the full column width (see context.md).
 */
export function FaqSection({
  className,
  items,
  copy,
}: FaqSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const faqs = items ?? faqItems;
  const sectionCopy = copy ?? faqSectionCopy;

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-label="Frequently asked questions"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.grid}>
        <div data-reveal className={styles.aside}>
          <SectionEyebrow className={styles.eyebrow}>
            {sectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{sectionCopy.title}</h2>
          {sectionCopy.body ? (
            <p className={styles.body}>{sectionCopy.body}</p>
          ) : null}
        </div>

        <div data-reveal className={styles.panel}>
          <Accordion type="single" collapsible className={styles.accordion}>
            {faqs.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className={styles.item}
              >
                <AccordionTrigger className={styles.trigger}>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className={styles.content}>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
