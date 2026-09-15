import Image from "next/image";

import { HeroAtmosphere } from "@/components/sections/hero-atmosphere";
import { heroShowcaseImages } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

import styles from "./hero.module.css";

type HeroProps = {
  className?: string;
};

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
 * Homepage Hero — Server Component shell for LCP text + decorative client atmosphere.
 * Heading and body are always in the initial HTML (never opacity:0 / never gated on JS).
 */
export function Hero({ className }: HeroProps) {
  return (
    <section data-hero className={cn(styles.section, className)}>
      <HeroAtmosphere />

      {/* Minimal veil — readability only, keeps Liquid Ether visible */}
      <div aria-hidden className={styles.veil} />

      <div className={styles.content}>
        <div className={styles.stack}>
          <h1 data-lcp className={styles.heading}>
            <span className={styles.line}>Xoomplus</span>{" "}
            <span className={styles.gradient}>Digital Marketing,</span>
            <span className={styles.line}>Web & Design Experts</span>{" "}
          </h1>

          <p data-hero-body className={styles.body}>
            Ready to shine online? At XoomPlus, we create smart digital
            marketing, web development, and design solutions that get attention,
            engage visitors, and drive sales. From SEO and social media to
            branding and beautiful websites, we help your business grow quickly
            and effectively
          </p>

          <div
            data-hero-trust
            className={styles.trust}
            aria-label="Trusted reviews"
          >
            <a
              href="https://www.google.com/search?sca_esv=2e0bf73006d1ba9f&rlz=1C1CHBF_enPK1130PK1131&kgmid=/g/11vx_slwfg&q=Xoomplus&shndl=30&shem=lcuae,lsctac,uaasie,shrtsdl&source=sh/x/loc/uni/m1/1&kgs=e67c915574c33667&utm_source=lcuae,lsctac,uaasie,shrtsdl,sh/x/loc/uni/m1/1#lrd=0x38df95000d84e457:0xe13a404eab3f5547,3,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.trustBadge}
            >
              <GoogleMark className={styles.trustIcon} />
              <span className={styles.trustMeta}>
                <span className={styles.trustName}>Google rating</span>
                <span className={styles.trustScore}>
                  <span className={styles.trustValue}>5.0</span>
                  <Stars />
                </span>
              </span>
            </a>

            <a
              href="https://www.trustpilot.com/review/xoomplus.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.trustBadge}
            >
              <TrustpilotMark className={styles.trustIcon} />
              <span className={styles.trustMeta}>
                <span className={styles.trustName}>Trustpilot</span>
                <span className={styles.trustScore}>
                  <TrustpilotStars />
                </span>
              </span>
            </a>

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

      {/* Decorative showcase — never competes with LCP text priority */}
      <div aria-hidden data-hero-visual className={styles.showcase}>
        <div className={styles.showcaseTrack}>
          {heroShowcaseImages.map((src, index) => (
            <div key={src} className={styles.card}>
              <Image
                src={src}
                alt=""
                width={360}
                height={480}
                sizes="(max-width: 639px) 11rem, 18vw"
                className={styles.cardImg}
                loading="lazy"
                fetchPriority="low"
                quality={65}
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
