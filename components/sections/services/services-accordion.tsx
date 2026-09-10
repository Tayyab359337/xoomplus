"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import type { ServiceCategory } from "@/lib/data/services";
import { cn } from "@/lib/utils";

import { ChildServicesCarousel } from "./child-services-carousel";
import styles from "./services-section.module.css";

type ServicesAccordionProps = {
  services: ServiceCategory[];
  className?: string;
};

/**
 * Optional stacked accordion — animated open + autoplay child carousel.
 * Kept for alternate layouts; homepage uses the infinite carousel on mobile.
 */
export function ServicesAccordion({
  services,
  className,
}: ServicesAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={cn(styles.accordion, className)}>
      {services.map((service) => {
        const open = openId === service.id;
        return (
          <div
            key={service.id}
            className={styles.accordionItem}
            data-tone={service.tone}
            data-open={open ? "true" : "false"}
          >
            <button
              type="button"
              className={styles.accordionSummary}
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : service.id)}
            >
              <span className={styles.accordionVisual} aria-hidden>
                <span className={styles.visualWash} />
              </span>
              <span className={styles.accordionCopy}>
                <span className={styles.cardTagline}>{service.tagline}</span>
                <span className={styles.accordionTitle}>{service.title}</span>
              </span>
              <span
                className={styles.expandChevron}
                data-open={open ? "true" : "false"}
                aria-hidden
              />
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="panel"
                  className={styles.accordionPanel}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className={styles.cardDescription}>{service.description}</p>
                  <ChildServicesCarousel
                    items={service.children}
                    active={open}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
