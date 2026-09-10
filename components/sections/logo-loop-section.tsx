"use client";

import LogoLoop from "@/components/LogoLoop";
import { partnerLogos } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

import styles from "./logo-loop-section.module.css";

function BrandMark({ name }: { name: string }) {
  return <span className={styles.brand}>{name}</span>;
}

const logos = partnerLogos.map((partner) => ({
  node: <BrandMark name={partner.name} />,
  title: partner.name,
  ariaLabel: partner.name,
  href: partner.href,
}));

type LogoLoopSectionProps = {
  className?: string;
};

/**
 * React Bits LogoLoop (JS + CSS) — seamless partner/tech strip under the Hero.
 */
export function LogoLoopSection({ className }: LogoLoopSectionProps) {
  return (
    <section
      aria-label="Partners and technologies"
      className={cn(styles.section, className)}
    >
      <div className={styles.header}>
        <p className={styles.meta}>Trusted by teams building next</p>
        <p className={styles.metaMuted}>Partners · platforms · tools</p>
      </div>

      <div className={styles.loopWrap}>
        <LogoLoop
          logos={logos}
          speed={70}
          direction="left"
          logoHeight={28}
          gap={64}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="var(--background)"
          ariaLabel="Partner and technology logos"
        />
      </div>
    </section>
  );
}
