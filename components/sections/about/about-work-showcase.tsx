"use client";

import { AboutCaseVideo } from "@/components/sections/about/about-case-video";
import { MetricsSection } from "@/components/sections/metrics-section";
import type { AgencyMetric } from "@/lib/data/homepage";
import type { SectionCopy } from "@/lib/wordpress/types";

import styles from "./about-work-showcase.module.css";

type AboutWorkShowcaseProps = {
  metrics?: AgencyMetric[];
  copy: SectionCopy;
};

/**
 * About case studies — homepage metrics band above the hosted About video.
 */
export function AboutWorkShowcase({ metrics, copy }: AboutWorkShowcaseProps) {
  return (
    <div>
      <MetricsSection
        variant="banner"
        metrics={metrics}
        copy={copy}
        ariaLabel="Case studies"
      />
      <section
        aria-label="Case study video"
        className={styles.videoSection}
      >
        <div className={styles.videoInner}>
          <AboutCaseVideo />
        </div>
      </section>
    </div>
  );
}
