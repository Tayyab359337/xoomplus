"use client";

import { AboutCaseVideo } from "@/components/sections/about/about-case-video";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import type { PortfolioProject } from "@/lib/data/portfolio";
import type { HomepagePortfolioCopy } from "@/lib/wordpress/types";

type AboutWorkShowcaseProps = {
  projects: PortfolioProject[];
  copy: HomepagePortfolioCopy;
};

/**
 * About case studies — homepage PortfolioSection + hosted case-study video dialog.
 */
export function AboutWorkShowcase({ projects, copy }: AboutWorkShowcaseProps) {
  return (
    <PortfolioSection
      projects={projects}
      copy={copy}
      ariaLabel="Case studies"
      media={<AboutCaseVideo />}
    />
  );
}
