import { useId } from "react";

import type { SeoProcessVisualId } from "@/lib/data/seo-process";
import { cn } from "@/lib/utils";

import styles from "./seo-process.module.css";

type SeoProcessVisualProps = {
  variant: SeoProcessVisualId;
  className?: string;
};

/**
 * Lightweight inline illustrations for each SEO process step.
 * Motion is CSS-only and gated by the parent card's data-active state.
 */
export function SeoProcessVisual({ variant, className }: SeoProcessVisualProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `seoProcGrad-${uid}`;

  return (
    <svg
      aria-hidden
      viewBox="0 0 200 120"
      className={cn(styles.visual, className)}
      data-visual={variant}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fea106" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {variant === "audit" && <AuditArt gradId={gradId} />}
      {variant === "technical" && <TechnicalArt gradId={gradId} />}
      {variant === "content" && <ContentArt gradId={gradId} />}
      {variant === "monitoring" && <MonitoringArt gradId={gradId} />}
    </svg>
  );
}

function AuditArt({ gradId }: { gradId: string }) {
  return (
    <g
      fill="none"
      stroke={`url(#${gradId})`}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className={styles.artTarget}>
        <circle cx="72" cy="58" r="34" opacity="0.35" />
        <circle cx="72" cy="58" r="22" opacity="0.55" />
        <circle cx="72" cy="58" r="8" fill="var(--accent)" stroke="none" opacity="0.85" />
      </g>
      <g className={styles.artBars}>
        <rect className={styles.artBar} data-bar="1" x="128" y="64" width="12" height="28" rx="2" />
        <rect className={styles.artBar} data-bar="2" x="146" y="48" width="12" height="44" rx="2" />
        <rect className={styles.artBar} data-bar="3" x="164" y="32" width="12" height="60" rx="2" />
      </g>
      <g className={styles.artMag}>
        <circle cx="118" cy="44" r="16" />
        <path d="M130 56 L148 76" strokeWidth="2" />
      </g>
    </g>
  );
}

function TechnicalArt({ gradId }: { gradId: string }) {
  return (
    <g
      fill="none"
      stroke={`url(#${gradId})`}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className={styles.artBrowser}>
        <rect x="18" y="22" width="92" height="64" rx="6" />
        <path d="M18 38 H110" opacity="0.6" />
        <circle cx="30" cy="30" r="2.2" fill="var(--accent)" stroke="none" />
        <circle cx="38" cy="30" r="2.2" opacity="0.5" fill="currentColor" stroke="none" />
        <circle cx="46" cy="30" r="2.2" opacity="0.35" fill="currentColor" stroke="none" />
      </g>
      <g className={styles.artGauge}>
        <path d="M132 78 A28 28 0 0 1 188 78" />
        <circle cx="160" cy="78" r="3.5" fill="var(--accent)" stroke="none" />
        <path className={styles.artNeedle} d="M160 78 L146 54" strokeWidth="2" />
      </g>
      <g className={styles.artChecks}>
        <path className={styles.artCheck} data-check="1" d="M28 52 L34 58 L46 46" />
        <path className={styles.artCheck} data-check="2" d="M28 66 L34 72 L46 60" />
        <path className={styles.artCheck} data-check="3" d="M54 52 H96" opacity="0.45" />
        <path className={styles.artCheck} data-check="4" d="M54 66 H88" opacity="0.3" />
      </g>
      <g className={styles.artNodes}>
        <circle cx="78" cy="96" r="3.5" fill="var(--accent)" stroke="none" />
        <circle cx="108" cy="96" r="3.5" />
        <circle cx="138" cy="96" r="3.5" />
        <path d="M82 96 H104 M112 96 H134" opacity="0.5" />
      </g>
    </g>
  );
}

function ContentArt({ gradId }: { gradId: string }) {
  return (
    <g
      fill="none"
      stroke={`url(#${gradId})`}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className={styles.artDoc}>
        <rect x="28" y="18" width="86" height="86" rx="6" />
        <path className={styles.artLine} data-line="1" d="M42 40 H96" strokeWidth="2" />
        <path className={styles.artLine} data-line="2" d="M42 54 H88" opacity="0.7" />
        <path className={styles.artLine} data-line="3" d="M42 66 H80" opacity="0.5" />
        <path className={styles.artLine} data-line="4" d="M42 78 H72" opacity="0.35" />
      </g>
      <g className={styles.artPencil}>
        <path d="M128 78 L168 28" strokeWidth="2" />
        <path d="M162 22 L178 38 L168 28 Z" fill="var(--accent)" fillOpacity="0.35" />
        <path d="M128 78 L122 90 L134 84 Z" fill="var(--accent)" fillOpacity="0.5" />
      </g>
      <g className={styles.artTags}>
        <rect className={styles.artTag} data-tag="1" x="122" y="84" width="36" height="14" rx="7" />
        <rect className={styles.artTag} data-tag="2" x="162" y="84" width="22" height="14" rx="7" />
      </g>
    </g>
  );
}

function MonitoringArt({ gradId }: { gradId: string }) {
  return (
    <g
      fill="none"
      stroke={`url(#${gradId})`}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className={styles.artChart}>
        <path d="M28 96 H172 M28 24 V96" opacity="0.35" />
        <path
          className={styles.artGraph}
          d="M40 78 L68 64 L92 70 L118 42 L148 50 L170 28"
          strokeWidth="2"
        />
      </g>
      <g className={styles.artTrend}>
        <path d="M148 38 L170 28 L170 46" strokeWidth="1.8" />
      </g>
      <g className={styles.artRefresh}>
        <path d="M168 78 A14 14 0 1 1 156 68" />
        <path d="M156 68 L164 62 L150 60" />
      </g>
    </g>
  );
}
