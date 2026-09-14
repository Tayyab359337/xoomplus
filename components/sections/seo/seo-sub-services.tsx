"use client";

import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { EASE, EASE_SOFT, gsap, registerGsapPlugins } from "@/lib/animations";
import {
  seoSubServices,
  seoSubServicesCopy,
  type SeoSubService,
} from "@/lib/data/seo-sub-services";
import { cn } from "@/lib/utils";

import { SeoSubServiceVisual } from "./seo-sub-service-visual";
import styles from "./seo-sub-services.module.css";

const FINE_HOVER_MQ = "(hover: hover) and (pointer: fine)";
const SWITCH_DUR = 0.42;

type SeoSubServicesProps = {
  className?: string;
  services?: SeoSubService[];
};

export function SeoSubServices({
  className,
  services = seoSubServices,
}: SeoSubServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const canHover = useMediaQuery(FINE_HOVER_MQ);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState<number | null>(0);

  const active = services[activeIndex] ?? services[0];

  useSectionReveal(sectionRef);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel || reduceMotion || !isDesktop) return;

      registerGsapPlugins();

      const title = panel.querySelector<HTMLElement>("[data-panel-title]");
      const desc = panel.querySelector<HTMLElement>("[data-panel-desc]");
      const visual = panel.querySelector<HTMLElement>("[data-panel-visual]");
      const accent = accentRef.current;

      const targets = [title, desc, visual].filter(Boolean) as HTMLElement[];

      const tl = gsap.timeline({
        defaults: { duration: SWITCH_DUR, ease: EASE, overwrite: "auto" },
      });

      tl.fromTo(
        targets,
        { opacity: 0, y: 14, x: -10 },
        { opacity: 1, y: 0, x: 0, stagger: 0.05, clearProps: "transform" },
        0,
      );

      if (accent) {
        tl.fromTo(
          accent,
          { scaleX: 0, opacity: 0.6 },
          { scaleX: 1, opacity: 1, duration: 0.35, ease: EASE_SOFT },
          0,
        );
      }
    },
    { dependencies: [activeIndex, reduceMotion, isDesktop], scope: panelRef },
  );

  const selectIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
    },
    [],
  );

  const onTabActivate = useCallback(
    (index: number) => {
      if (canHover && isDesktop) {
        selectIndex(index);
        return;
      }
      selectIndex(index);
    },
    [canHover, isDesktop, selectIndex],
  );

  const onTabKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onTabActivate(index);
        return;
      }
      if (!isDesktop) return;

      let next = index;
      if (event.key === "ArrowRight") next = Math.min(services.length - 1, index + 1);
      if (event.key === "ArrowLeft") next = Math.max(0, index - 1);
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = services.length - 1;
      if (next !== index) {
        event.preventDefault();
        selectIndex(next);
        const tabs = sectionRef.current?.querySelectorAll<HTMLButtonElement>(
          "[data-seo-rail-tab]",
        );
        tabs?.[next]?.focus();
      }
    },
    [isDesktop, onTabActivate, selectIndex, services.length],
  );

  const toggleMobile = useCallback((index: number) => {
    setMobileOpen((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="seo-capabilities"
      aria-labelledby="seo-subservices-heading"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <header data-reveal className={styles.intro}>
          <SectionEyebrow className={styles.eyebrow}>
            {seoSubServicesCopy.eyebrow}
          </SectionEyebrow>
          <h2 id="seo-subservices-heading" className={styles.title}>
            {seoSubServicesCopy.title}
          </h2>
          <p className={styles.body}>{seoSubServicesCopy.body}</p>
        </header>

        <div
          data-reveal
          className={styles.desktopStage}
          aria-label="SEO capability explorer"
        >
          <div
            role="tablist"
            aria-label="SEO services"
            className={styles.rail}
          >
            {services.map((service, index) => {
              const isActive = activeIndex === index;
              const number = String(index + 1).padStart(2, "0");
              return (
                <button
                  key={service.slug}
                  type="button"
                  role="tab"
                  id={`seo-tab-${service.slug}`}
                  aria-selected={isActive}
                  aria-controls="seo-service-panel"
                  data-seo-rail-tab
                  tabIndex={isActive ? 0 : -1}
                  className={cn(
                    styles.railTab,
                    isActive ? styles.railTabActive : styles.railTabInactive,
                  )}
                  onClick={() => onTabActivate(index)}
                  onMouseEnter={() => {
                    if (canHover) selectIndex(index);
                  }}
                  onFocus={() => selectIndex(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span className={styles.railNum}>{number}</span>
                  <span>{service.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <div
            ref={panelRef}
            id="seo-service-panel"
            role="tabpanel"
            aria-labelledby={`seo-tab-${active.slug}`}
            className={styles.panelWrap}
            data-active="true"
          >
            <span aria-hidden className={styles.connectLine} />
            <div ref={accentRef} className={styles.panelAccent} />
            <div className={styles.panelGrid}>
              <div className={styles.panelCopy}>
                <div className={styles.panelMeta}>
                  <span className={styles.panelNumber}>
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.panelLabel}>{active.shortLabel}</span>
                </div>
                <h3 data-panel-title className={styles.panelTitle}>
                  {active.title}
                </h3>
                <p data-panel-desc className={styles.panelDesc}>
                  {active.description}
                </p>
              </div>
              <div data-panel-visual className={styles.panelVisual}>
                <SeoSubServiceVisual variant={active.visual} />
              </div>
            </div>
          </div>
        </div>

        <ul className={styles.mobileList} aria-label="SEO services">
          {services.map((service, index) => {
            const expanded = mobileOpen === index;
            const number = String(index + 1).padStart(2, "0");
            return (
              <li
                key={service.slug}
                className={cn(
                  styles.mobileItem,
                  expanded && styles.mobileItemExpanded,
                )}
              >
                <button
                  type="button"
                  className={styles.mobileTrigger}
                  aria-expanded={expanded}
                  aria-controls={`seo-mobile-${service.slug}`}
                  onClick={() => toggleMobile(index)}
                >
                  <span className={styles.mobileNum}>{number}</span>
                  <span className={styles.mobileHead}>
                    <span className={styles.mobileTitle}>{service.title}</span>
                    <span className={styles.mobileShort}>
                      {service.shortLabel}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn("size-4", styles.mobileChevron)}
                  />
                </button>
                <div
                  id={`seo-mobile-${service.slug}`}
                  className={styles.mobilePanel}
                  aria-hidden={!expanded}
                >
                  <div className={styles.mobilePanelInner}>
                    <div className={styles.mobileBody}>
                      <p className={styles.mobileDesc}>{service.description}</p>
                      <div className={styles.mobileVisual}>
                        <SeoSubServiceVisual variant={service.visual} />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
