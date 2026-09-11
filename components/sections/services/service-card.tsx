"use client";

import { motion } from "motion/react";
import type { MutableRefObject } from "react";

import type { ServiceCategory } from "@/lib/data/services";
import { cn } from "@/lib/utils";

import { ChildServicesCarousel } from "./child-services-carousel";
import styles from "./services-section.module.css";

type ServiceCardProps = {
  service: ServiceCategory;
  expanded: boolean;
  secondary: boolean;
  /** Unique key for duplicated track instances */
  instanceKey: string;
  interaction: "hover" | "tap";
  onExpand: (key: string | null) => void;
  /** When true after a drag gesture, ignore expand/collapse clicks */
  suppressToggle?: MutableRefObject<boolean>;
};

/**
 * Expandable service panel — mini interactive surface, not a modal.
 * Tap mode uses an accordion-style chevron to open sub-services.
 * Pointer events bubble so the parent track can touch-drag on mobile.
 */
export function ServiceCard({
  service,
  expanded,
  secondary,
  instanceKey,
  interaction,
  onExpand,
  suppressToggle,
}: ServiceCardProps) {
  const expand = () => onExpand(instanceKey);
  const collapse = () => onExpand(null);
  const toggle = () => {
    if (suppressToggle?.current) return;
    onExpand(expanded ? null : instanceKey);
  };

  return (
    <motion.article
      layout
      data-tone={service.tone}
      data-expanded={expanded ? "true" : "false"}
      data-services-card={instanceKey}
      data-secondary={secondary ? "true" : "false"}
      className={cn(styles.card, expanded && styles.cardExpanded)}
      onMouseEnter={interaction === "hover" ? expand : undefined}
      onMouseLeave={interaction === "hover" ? collapse : undefined}
      transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className={styles.cardBody}>
        <motion.div
          layout="position"
          className={styles.cardVisual}
          aria-hidden
          initial={false}
          animate={{ x: expanded ? -6 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.visualWash} />
          {service.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote WP service thumbs in existing visual slot
            <img
              src={service.image}
              alt=""
              className={styles.visualImage}
            />
          ) : (
            <span className={styles.visualMark}>{service.title.slice(0, 1)}</span>
          )}
        </motion.div>

        <motion.div
          layout="position"
          className={styles.cardCopy}
          initial={false}
          animate={{ x: expanded ? 8 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.cardCopyTop}>
            <h3 className={styles.cardTitle}>{service.title}</h3>
            {interaction === "tap" ? (
              <button
                type="button"
                className={styles.expandBtn}
                aria-expanded={expanded}
                aria-label={
                  expanded
                    ? `Collapse ${service.title}`
                    : `Open ${service.title} sub-services`
                }
                onClick={(event) => {
                  event.stopPropagation();
                  toggle();
                }}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <span
                  className={styles.expandChevron}
                  data-open={expanded ? "true" : "false"}
                  aria-hidden
                />
              </button>
            ) : null}
          </div>

          <p className={styles.cardTagline}>{service.tagline}</p>

          {interaction === "tap" && !expanded ? (
            <button
              type="button"
              className={styles.cardTapHint}
              onClick={(event) => {
                event.stopPropagation();
                toggle();
              }}
              onPointerDown={(event) => event.stopPropagation()}
            >
              View disciplines
            </button>
          ) : null}

          {expanded ? (
            <motion.p
              key={`${instanceKey}-desc`}
              className={styles.cardDescription}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              {service.description}
            </motion.p>
          ) : null}
        </motion.div>
      </div>

      <ChildServicesCarousel items={service.children} active={expanded} />
    </motion.article>
  );
}
