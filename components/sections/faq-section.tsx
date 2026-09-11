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
import { faqItems, faqSectionCopy } from "@/lib/data/faq";
import { cn } from "@/lib/utils";

import styles from "./faq-section.module.css";

type FaqSectionProps = {
  className?: string;
};

/**
 * FAQ — left editorial copy, right shadcn Accordion (not full-bleed).
 */
export function FaqSection({ className }: FaqSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

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
            {faqSectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{faqSectionCopy.title}</h2>
          <p className={styles.body}>{faqSectionCopy.body}</p>
        </div>

        <div data-reveal className={styles.panel}>
          <Accordion type="single" collapsible className={styles.accordion}>
            {faqItems.map((item) => (
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
