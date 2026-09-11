"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
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
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className={cn(styles.section, className)}
    >
      <div className={styles.grid}>
        <div data-animate="fade-up" className={styles.aside}>
          <SectionEyebrow className={styles.eyebrow}>
            {faqSectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{faqSectionCopy.title}</h2>
          <p className={styles.body}>{faqSectionCopy.body}</p>
        </div>

        <div
          data-animate="fade-up"
          data-animate-delay="0.08"
          className={styles.panel}
        >
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
