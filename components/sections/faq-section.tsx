"use client";

import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
        <Reveal variant="fadeUp" className={styles.aside}>
          <p className={styles.eyebrow}>{faqSectionCopy.eyebrow}</p>
          <h2 className={styles.title}>{faqSectionCopy.title}</h2>
          <p className={styles.body}>{faqSectionCopy.body}</p>
        </Reveal>

        <Reveal variant="fadeUp" delay={0.08} className={styles.panel}>
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
        </Reveal>
      </div>
    </section>
  );
}
