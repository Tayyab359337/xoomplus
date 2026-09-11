"use client";

import { useRef } from "react";

import LogoLoop from "@/components/LogoLoop";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { partnerLogos, type PartnerLogo } from "@/lib/data/homepage";
import { cn } from "@/lib/utils";

import styles from "./logo-loop-section.module.css";

function BrandMark({ name }: { name: string }) {
  return <span className={styles.brand}>{name}</span>;
}

function toLogoItems(logos: PartnerLogo[]) {
  return logos.map((partner) =>
    partner.src
      ? {
          src: partner.src,
          alt: partner.name,
          title: partner.name,
          href: partner.href,
          height: 28,
        }
      : {
          node: <BrandMark name={partner.name} />,
          title: partner.name,
          ariaLabel: partner.name,
          href: partner.href,
        },
  );
}

type LogoLoopSectionProps = {
  className?: string;
  logos?: PartnerLogo[];
  copy?: { eyebrow?: string; title?: string; body?: string };
};

/**
 * React Bits LogoLoop — partner strip under the Hero.
 * Dark theme uses a muted zinc band so black logos stay readable
 * without invert filters (which wash colored logos to white).
 */
export function LogoLoopSection({
  className,
  logos,
  copy,
}: LogoLoopSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const items = toLogoItems(logos ?? partnerLogos);

  return (
    <section
      ref={sectionRef}
      aria-label="Partners and technologies"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div data-reveal className={styles.header}>
        <p className={styles.meta}>
          {copy?.eyebrow || "Brands That Believe in Us"}
        </p>
        {copy?.body ? (
          <p className={styles.metaMuted}>{copy.body}</p>
        ) : (
          <p className={styles.metaMuted}>Partners · platforms · tools</p>
        )}
      </div>

      <div data-reveal className={styles.loopWrap}>
        <LogoLoop
          logos={items}
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
