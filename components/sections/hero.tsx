"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import { DotPattern } from "@/components/ui/dot-pattern";
import { useIsClient } from "@/hooks/use-is-client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { heroShowcaseImages } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

import styles from "./hero.module.css";

const LiquidEther = dynamic(() => import("@/components/effects/liquid-ether"), {
  ssr: false,
  loading: () => null,
});

/** Teal brand field — variants of #478997 / #3D7883 */
const ETHER_COLORS_DARK = ["#2f6b76", "#3D7883", "#6aadb8"];
const ETHER_COLORS_LIGHT = ["#478997", "#2f6b76", "#5a9aa5"];

type HeroProps = {
  className?: string;
};

function canUseHeroWebGL(): boolean {
  if (typeof window === "undefined") return false;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const compact = window.matchMedia("(max-width: 768px)").matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (coarse || compact || nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  return true;
}

function LightningBolt({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M13.2 2.1 4.8 13.4c-.35.47-.01 1.13.58 1.13h5.02l-1.05 7.18c-.12.82.9 1.3 1.42.67l9.05-11.1c.38-.47.04-1.18-.57-1.18h-5.3l.7-7.32c.08-.84-.94-1.28-1.45-.68Z" />
    </svg>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

function TrustpilotMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 24 24" fill="#00B67A">
      <path d="M12 1.5 14.7 9.1H22.8l-6.6 4.8 2.5 7.6L12 16.7 5.3 21.5l2.5-7.6L1.2 9.1h8.1L12 1.5Z" />
    </svg>
  );
}

function Stars() {
  return (
    <span className={styles.stars} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 12 12" className={styles.star}>
          <path d="M6 0.6 7.6 4.4 11.7 4.7 8.6 7.4 9.6 11.4 6 9.3 2.4 11.4 3.4 7.4 0.3 4.7 4.4 4.4 6 0.6Z" />
        </svg>
      ))}
    </span>
  );
}

function TrustpilotStars() {
  return (
    <span className={styles.tpStars} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={styles.tpCell}>
          <svg viewBox="0 0 12 12" className={styles.tpStar}>
            <path d="M6 0.6 7.6 4.4 11.7 4.7 8.6 7.4 9.6 11.4 6 9.3 2.4 11.4 3.4 7.4 0.3 4.7 4.4 4.4 6 0.6Z" />
          </svg>
        </span>
      ))}
    </span>
  );
}

/**
 * Homepage Hero — LiquidEther (protected) + centered reference composition.
 * Primary heading is always visible HTML (never opacity:0 for LCP).
 * Trust strip sits above the primary CTA.
 */
export function Hero({ className }: HeroProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const allowWebGL = isClient && !reduceMotion && canUseHeroWebGL();
  const isLight = isClient && resolvedTheme === "light";
  /** Mount dots only on mobile — never paint on desktop. */
  const showDotPattern = isClient && isMobile;

  return (
    <section data-hero className={cn(styles.section, className)}>
      {/* WebGL atmosphere — decorative, never blocks LCP text */}
      <div aria-hidden data-hero-visual className={styles.ether}>
        {allowWebGL ? (
          <LiquidEther
            colors={isLight ? ETHER_COLORS_LIGHT : ETHER_COLORS_DARK}
            mouseForce={18}
            cursorSize={110}
            isViscous={false}
            viscous={30}
            iterationsViscous={12}
            iterationsPoisson={12}
            resolution={0.22}
            isBounce={false}
            autoDemo={false}
            autoSpeed={0.45}
            autoIntensity={2}
            takeoverDuration={0.25}
            autoResumeDelay={2800}
            autoRampDuration={0.6}
            BFECC={false}
            lightMode={isLight}
            backgroundColor={isLight ? "#f4f8f9" : "#04070a"}
            style={{ width: "100%", height: "100%", position: "absolute" }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--accent)_18%,transparent),transparent_55%)]" />
        )}
      </div>

      {/* Minimal veil — readability only, keeps Liquid Ether visible */}
      <div aria-hidden className={styles.veil} />

      {/* Mobile-only Magic UI dots — absolute, faded; not mounted on desktop */}
      {showDotPattern ? (
        <div aria-hidden className={styles.dotPattern}>
          <DotPattern
            width={18}
            height={18}
            cr={1}
            className="text-foreground/[0.07] dark:text-foreground/[0.09]"
          />
        </div>
      ) : null}

      <div className={styles.content}>
        <div className={styles.stack}>
          {/* Real HTML heading for LCP — visible without JS animation */}
          <h1 data-lcp className={styles.heading}>
            <span className={styles.line}>Xoomplus</span>{" "}
            <span className={styles.gradient}>
            Digital Marketing,
            </span>
            <span className={styles.line}>Web & Design Experts</span>{" "}
          </h1>

          <p data-hero-body className={styles.body}>
          Ready to shine online? At XoomPlus, we create smart digital marketing, web development, and design solutions that get attention, engage visitors, and drive sales. From SEO and social media to branding and beautiful websites, we help your business grow quickly and effectively
          </p>

          <div
            data-hero-trust
            className={styles.trust}
            aria-label="Trusted reviews"
          >
            <div className={styles.trustBadge}>
              <GoogleMark className={styles.trustIcon} />
              <div className={styles.trustMeta}>
                <span className={styles.trustName}>Google rating</span>
                <span className={styles.trustScore}>
                  <span className={styles.trustValue}>5.0</span>
                  <Stars />
                </span>
              </div>
            </div>

            <div className={styles.trustBadge}>
              <TrustpilotMark className={styles.trustIcon} />
              <div className={styles.trustMeta}>
                <span className={styles.trustName}>Trustpilot</span>
                <span className={styles.trustScore}>
                  <TrustpilotStars />
                </span>
              </div>
            </div>

            <span aria-hidden className={styles.trustDivider} />
            <span className={styles.trustLabel}>Trusted Reviews</span>
          </div>

          <div data-hero-actions className={styles.actions}>
            <a href="#contact" className="btn-primary min-w-[10.5rem]">
              Book a call
            </a>
          </div>
        </div>
      </div>

      {/* Static showcase strip — reference composition, no mouse parallax */}
      <div
        aria-hidden
        data-hero-visual
        className={styles.showcase}
      >
        <div className={styles.showcaseTrack}>
          {heroShowcaseImages.map((src, index) => (
            <div key={src} className={styles.card}>
              {/* Decorative only — next/image not required for LCP here */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className={styles.cardImg}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority="low"
              />
              {index === 2 ? (
                <div className={styles.play}>
                  <span className={styles.playDot}>
                    <svg
                      className={styles.playIcon}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M8.2 5.6v12.8c0 .7.76 1.12 1.35.74l9.4-6.4a.88.88 0 0 0 0-1.48l-9.4-6.4a.88.88 0 0 0-1.35.74Z" />
                    </svg>
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
