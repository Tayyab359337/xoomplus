"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LocationMegaMenu } from "@/components/locations/location-mega-menu";
import Magnet from "@/components/ui/magnet";
import { useIsClient } from "@/hooks/use-is-client";
import {
  portfolioProjects,
  portfolioSectionCopy,
} from "@/lib/data/portfolio";
import {
  servicesMegaColumns,
  servicesMegaFeatured,
} from "@/lib/data/services-mega-menu";
import {
  CATEGORY_TAGLINES,
  themeIconSvg,
} from "@/lib/data/services-mega-ui";
import { cn } from "@/lib/utils";
import { mapWpHref } from "@/lib/wordpress/urls";

import styles from "./mobile-nav.module.css";

/** Same labels/hrefs as desktop nav — relative for current host */
const TOP_LINKS = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "/about/" },
] as const;

const BOTTOM_LINKS = [
  { name: "Blogs", link: "/blogs/" },
  { name: "Contact Us", link: "/contact/" },
] as const;

const QUOTE_HREF = "/appointment-booking/";

function linkIndex(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Mobile nav portaled to document.body so backdrop-filter isn't killed by
 * app wrappers / scroll libraries. Links match desktop; Services + Portfolios
 * use accordion megas.
 */
export function MobileNav() {
  const isClient = useIsClient();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [portfoliosOpen, setPortfoliosOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const servicesRef = useRef<HTMLLIElement>(null);
  const portfoliosRef = useRef<HTMLLIElement>(null);
  const locationsRef = useRef<HTMLLIElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 100);
  });

  useEffect(() => {
    document.body.toggleAttribute("data-mobile-nav-open", open);
    if (!open) {
      setServicesOpen(false);
      setPortfoliosOpen(false);
      setLocationsOpen(false);
      setActiveCategory(0);
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.removeAttribute("data-mobile-nav-open");
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!servicesOpen) return;
    const id = window.setTimeout(() => {
      servicesRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }, 300);
    return () => window.clearTimeout(id);
  }, [servicesOpen]);

  useEffect(() => {
    if (!portfoliosOpen) return;
    const id = window.setTimeout(() => {
      portfoliosRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }, 300);
    return () => window.clearTimeout(id);
  }, [portfoliosOpen]);

  useEffect(() => {
    if (!locationsOpen) return;
    const id = window.setTimeout(() => {
      locationsRef.current?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }, 300);
    return () => window.clearTimeout(id);
  }, [locationsOpen]);

  const close = () => setOpen(false);
  const compact = scrolled || open;
  const activeColumn =
    servicesMegaColumns[activeCategory] ?? servicesMegaColumns[0];
  const featuredPortfolios = portfolioProjects.slice(0, 2);

  if (!isClient) return null;

  let stagger = 0;
  const nextDelay = () => {
    const delay = 0.05 + stagger * 0.05;
    stagger += 1;
    return delay;
  };

  return createPortal(
    <div className={styles.root} data-mobile-nav="">
      <header
        className={cn(
          styles.bar,
          compact && styles.barCompact,
          compact && styles.barFrost,
          open && styles.barOpen,
        )}
      >
        <div className={styles.barRow}>
          <BrandMark height={28} onClick={close} />
          <div className={styles.actions}>
            <ThemeToggle className="size-8" />
            <button
              type="button"
              className={styles.ham}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              onClick={() => setOpen((value) => !value)}
            >
              <span
                className={styles.hamIcon}
                data-open={open ? "true" : "false"}
              >
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <div key="backdrop" className={styles.backdrop} aria-hidden />
            <button
              key="backdrop-hit"
              type="button"
              className={styles.backdropHit}
              aria-label="Close menu"
              onClick={close}
            />
            <nav
              key="panel"
              id="mobile-nav-panel"
              className={styles.panel}
              aria-label="Mobile navigation"
            >
              <ul className={styles.list}>
                {TOP_LINKS.map((item, index) => (
                  <motion.li
                    key={item.link}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: nextDelay(),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a href={item.link} className={styles.link} onClick={close}>
                      <span className={styles.linkLabel}>{item.name}</span>
                      <span className={styles.linkIndex}>
                        {linkIndex(index + 1)}
                      </span>
                    </a>
                  </motion.li>
                ))}

                {/* Services accordion */}
                <motion.li
                  ref={servicesRef}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: nextDelay(),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={styles.servicesBlock}
                >
                  <button
                    type="button"
                    className={styles.link}
                    aria-expanded={servicesOpen}
                    onClick={() => {
                      setServicesOpen((v) => !v);
                      setPortfoliosOpen(false);
                      setLocationsOpen(false);
                    }}
                  >
                    <span className={styles.linkLabel}>
                      Services
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "ml-2 inline size-4 shrink-0 opacity-70 transition-transform duration-200 ease-out",
                          servicesOpen && "rotate-180",
                        )}
                      />
                    </span>
                    <span className={styles.linkIndex}>
                      {servicesOpen ? "−" : "03"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {servicesOpen ? (
                      <motion.div
                        key="services-mega"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={styles.servicesPanel}
                      >
                        <div className={styles.megaInner}>
                          <div className={styles.megaParents}>
                            {servicesMegaColumns.map((column, index) => {
                              const isActive = index === activeCategory;
                              return (
                                <a
                                  key={column.href}
                                  href={mapWpHref(column.href)}
                                  aria-current={isActive ? "true" : undefined}
                                  onClick={(event) => {
                                    // First tap selects children; tap again follows the parent link
                                    if (index !== activeCategory) {
                                      event.preventDefault();
                                      setActiveCategory(index);
                                    } else {
                                      close();
                                    }
                                  }}
                                  className={cn(
                                    styles.megaParent,
                                    isActive && styles.megaParentActive,
                                  )}
                                >
                                  <span className={styles.megaParentText}>
                                    <span className={styles.megaParentTitle}>
                                      {column.title}
                                    </span>
                                    <span className={styles.megaParentSub}>
                                      {CATEGORY_TAGLINES[column.title] ??
                                        "Explore services"}
                                    </span>
                                  </span>
                                  <span
                                    aria-hidden
                                    className={styles.megaParentArrow}
                                  >
                                    <ArrowUpRight className="size-3.5" />
                                  </span>
                                </a>
                              );
                            })}
                          </div>

                          <ul className={styles.megaChildren}>
                            {activeColumn.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={mapWpHref(link.href)}
                                  className={styles.megaChild}
                                  onClick={close}
                                >
                                  <span
                                    className={styles.megaChildIcon}
                                    dangerouslySetInnerHTML={{
                                      __html: themeIconSvg(link.iconSvg),
                                    }}
                                  />
                                  <span>{link.label}</span>
                                </a>
                              </li>
                            ))}
                          </ul>

                          <div className={styles.megaFeatured}>
                            <p className={styles.megaFeaturedTitle}>
                              {servicesMegaFeatured.title}
                            </p>
                            <p className={styles.megaFeaturedBody}>
                              {servicesMegaFeatured.description}
                            </p>
                            <a
                              href={mapWpHref(servicesMegaFeatured.href)}
                              className={styles.megaFeaturedBtn}
                              aria-label="View all services"
                              onClick={close}
                            >
                              <ArrowUpRight className="size-4" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>

                {/* Portfolios accordion — 2 cards in one row */}
                <motion.li
                  ref={portfoliosRef}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: nextDelay(),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={styles.servicesBlock}
                >
                  <button
                    type="button"
                    className={styles.link}
                    aria-expanded={portfoliosOpen}
                    onClick={() => {
                      setPortfoliosOpen((v) => !v);
                      setServicesOpen(false);
                      setLocationsOpen(false);
                    }}
                  >
                    <span className={styles.linkLabel}>
                      Portfolios
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "ml-2 inline size-4 shrink-0 opacity-70 transition-transform duration-200 ease-out",
                          portfoliosOpen && "rotate-180",
                        )}
                      />
                    </span>
                    <span className={styles.linkIndex}>
                      {portfoliosOpen ? "−" : "04"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {portfoliosOpen ? (
                      <motion.div
                        key="portfolios-mega"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={styles.servicesPanel}
                      >
                        <div className={styles.megaInner}>
                          <div className={styles.portfolioRow}>
                            {featuredPortfolios.map((project) => (
                              <a
                                key={project.id}
                                href={project.href}
                                className={styles.portfolioCard}
                                onClick={close}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={project.image}
                                  alt={project.imageAlt}
                                  width={640}
                                  height={360}
                                  className={styles.portfolioImg}
                                />
                                <span className={styles.portfolioMeta}>
                                  <span className={styles.portfolioTitle}>
                                    {project.title}
                                  </span>
                                  <span className={styles.portfolioCat}>
                                    {project.category}
                                  </span>
                                </span>
                              </a>
                            ))}
                          </div>
                          <a
                            href={portfolioSectionCopy.exploreCta.href}
                            className={styles.portfolioMore}
                            onClick={close}
                          >
                            {portfolioSectionCopy.exploreCta.label}
                            <ArrowUpRight className="size-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>

                {/* Locations accordion */}
                <motion.li
                  ref={locationsRef}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: nextDelay(),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={styles.servicesBlock}
                >
                  <button
                    type="button"
                    className={styles.link}
                    aria-expanded={locationsOpen}
                    onClick={() => {
                      setLocationsOpen((v) => !v);
                      setServicesOpen(false);
                      setPortfoliosOpen(false);
                    }}
                  >
                    <span className={styles.linkLabel}>
                      Locations
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "ml-2 inline size-4 shrink-0 opacity-70 transition-transform duration-200 ease-out",
                          locationsOpen && "rotate-180",
                        )}
                      />
                    </span>
                    <span className={styles.linkIndex}>
                      {locationsOpen ? "−" : "05"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {locationsOpen ? (
                      <motion.div
                        key="locations-mega"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={styles.servicesPanel}
                      >
                        <div className={styles.megaInner}>
                          <LocationMegaMenu
                            className="p-0 sm:p-0 gap-3"
                            onNavigate={close}
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>

                {BOTTOM_LINKS.map((item, index) => (
                  <motion.li
                    key={item.link}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: nextDelay(),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a href={item.link} className={styles.link} onClick={close}>
                      <span className={styles.linkLabel}>{item.name}</span>
                      <span className={styles.linkIndex}>
                        {linkIndex(index + 6)}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className={styles.footer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <Magnet padding={40} magnetStrength={3}>
                  <a
                    href={QUOTE_HREF}
                    className={cn("btn-primary", styles.cta)}
                    onClick={close}
                  >
                    Get a Quote
                    <span aria-hidden className="translate-y-px text-[0.95em]">
                      →
                    </span>
                  </a>
                </Magnet>
              </motion.div>
            </nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
