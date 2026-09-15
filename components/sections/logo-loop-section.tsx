"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";

import LogoLoop from "@/components/LogoLoop";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useIsClient } from "@/hooks/use-is-client";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import type { PartnerLogo } from "@/lib/data/homepage";
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
          height: 40,
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
 * Partner strip under the Hero — logos come from WordPress (homepage carousel).
 * Dark mode: no left/right fade masks (they fight the zinc logo band).
 */
export function LogoLoopSection({
  className,
  logos,
  copy,
}: LogoLoopSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const isClient = useIsClient();
  const { resolvedTheme } = useTheme();
  const isDark = isClient && resolvedTheme === "dark";

  // Only WordPress logos — never fall back to placeholder tech brand names.
  const items = toLogoItems(logos && logos.length > 0 ? logos : []);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Partners and technologies"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div data-reveal className={styles.header}>
        <SectionEyebrow className={styles.eyebrow}>
          {copy?.eyebrow || "Brands That Believe in Us"}
        </SectionEyebrow>
        {copy?.body ? (
          <p className={styles.body}>{copy.body}</p>
        ) : (
          <p className={styles.body}>Partners · platforms · tools</p>
        )}
      </div>

      <div className={styles.loopWrap} data-logo-fade={isDark ? "off" : "on"}>
        <LogoLoop
          logos={items}
          speed={55}
          direction="left"
          logoHeight={40}
          gap={64}
          pauseOnHover
          scaleOnHover
          fadeOut={!isDark}
          fadeOutColor={isDark ? undefined : "var(--background)"}
          ariaLabel="Partner and technology logos"
        />
      </div>
    </section>
  );
}
