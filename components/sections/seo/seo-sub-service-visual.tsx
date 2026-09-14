import type { SeoSubServiceVisual } from "@/lib/data/seo-sub-services";
import { cn } from "@/lib/utils";

import styles from "./seo-sub-services.module.css";

type SeoSubServiceVisualProps = {
  variant: SeoSubServiceVisual;
  className?: string;
};

/** Lightweight abstract visuals — shared language, no stock icons. */
export function SeoSubServiceVisual({
  variant,
  className,
}: SeoSubServiceVisualProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 200"
      className={cn(styles.visualSvg, className)}
      data-visual={variant}
    >
      <defs>
        <linearGradient id="seoVisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="318"
        height="198"
        rx="12"
        fill="none"
        stroke="color-mix(in srgb, var(--border) 85%, transparent)"
        strokeWidth="1"
      />
      <g stroke="url(#seoVisGrad)" strokeWidth="1.25" fill="none" opacity="0.9">
        {variant === "on-page" && (
          <>
            <rect x="48" y="52" width="224" height="28" rx="4" />
            <rect x="48" y="92" width="160" height="8" rx="2" opacity="0.6" />
            <rect x="48" y="108" width="200" height="8" rx="2" opacity="0.45" />
            <rect x="48" y="124" width="120" height="8" rx="2" opacity="0.35" />
          </>
        )}
        {variant === "off-page" && (
          <>
            <circle cx="96" cy="100" r="22" />
            <circle cx="224" cy="72" r="14" />
            <circle cx="224" cy="128" r="14" />
            <path d="M118 92 L202 78 M118 108 L202 122" />
          </>
        )}
        {variant === "technical" && (
          <>
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3, 4].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={56 + col * 44}
                  y={48 + row * 36}
                  width="32"
                  height="24"
                  rx="3"
                  opacity={0.35 + (row + col) * 0.06}
                />
              )),
            )}
          </>
        )}
        {variant === "keywords" && (
          <>
            <path d="M56 140 L96 80 L136 120 L176 64 L216 100 L264 56" />
            {[56, 96, 136, 176, 216, 264].map((x, i) => (
              <circle key={x} cx={x} cy={[140, 80, 120, 64, 100, 56][i]} r="5" fill="var(--accent)" />
            ))}
          </>
        )}
        {variant === "tech-audit" && (
          <>
            <path d="M160 44 L248 100 L160 156 L72 100 Z" />
            <circle cx="160" cy="100" r="18" />
            <path d="M160 118 L160 132 M152 124 L168 124" strokeWidth="2" />
          </>
        )}
        {variant === "local" && (
          <>
            <circle cx="160" cy="92" r="36" />
            <circle cx="160" cy="92" r="8" fill="var(--accent)" />
            <path d="M160 128 L160 152 M140 140 L180 140" />
          </>
        )}
        {variant === "links" && (
          <>
            <path d="M72 100 L120 100 M200 100 L248 100" />
            <path d="M120 88 C120 88 140 72 160 88 C180 104 200 88 200 88" />
            <path d="M120 112 C120 112 140 128 160 112 C180 96 200 112 200 112" />
          </>
        )}
        {variant === "competitors" && (
          <>
            <rect x="72" y="72" width="56" height="56" rx="6" opacity="0.5" />
            <rect x="132" y="56" width="56" height="72" rx="6" />
            <rect x="192" y="80" width="56" height="48" rx="6" opacity="0.65" />
          </>
        )}
        {variant === "analytics" && (
          <>
            <path d="M64 148 L104 108 L144 124 L184 76 L224 96 L256 64" opacity="0.85" />
            <line x1="64" y1="160" x2="256" y2="160" opacity="0.35" />
            <line x1="64" y1="56" x2="64" y2="160" opacity="0.35" />
          </>
        )}
        {variant === "full-audit" && (
          <>
            <circle cx="160" cy="100" r="52" opacity="0.35" />
            <circle cx="160" cy="100" r="32" />
            <path d="M160 68 L160 100 L184 112" />
          </>
        )}
        {variant === "content" && (
          <>
            <rect x="72" y="56" width="176" height="88" rx="8" opacity="0.4" />
            <rect x="88" y="72" width="120" height="10" rx="2" />
            <rect x="88" y="92" width="144" height="6" rx="2" opacity="0.55" />
            <rect x="88" y="106" width="128" height="6" rx="2" opacity="0.45" />
            <rect x="88" y="120" width="96" height="6" rx="2" opacity="0.35" />
          </>
        )}
      </g>
    </svg>
  );
}
