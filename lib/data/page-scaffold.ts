import { professionalCtaCopy } from "@/lib/data/cta";
import type { HomepageCta } from "@/lib/wordpress/types";

/**
 * Minimal shared content for lightweight page scaffolds.
 * Footer is rendered once from the root layout (homepage footer).
 */
export const pageScaffoldContent = {
  cta: professionalCtaCopy as HomepageCta,
};
