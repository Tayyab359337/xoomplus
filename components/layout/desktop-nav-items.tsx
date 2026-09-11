"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { HoverLift } from "@/components/animations/HoverLift";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import {
  servicesMegaColumns,
  servicesMegaFeatured,
} from "@/lib/data/services-mega-menu";
import {
  CATEGORY_TAGLINES,
  themeIconSvg,
} from "@/lib/data/services-mega-ui";
import {
  portfolioProjects,
  portfolioSectionCopy,
} from "@/lib/data/portfolio";
import { cn } from "@/lib/utils";

type NavLink = { name: string; link: string };

/** Labels/hrefs from reference/xm-services-menu.html */
const LEFT_LINKS: NavLink[] = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "https://xoomplus.co.uk/about/" },
];
const RIGHT_LINKS: NavLink[] = [
  { name: "Blogs", link: "https://xoomplus.co.uk/blogs/" },
  { name: "Contact Us", link: "https://xoomplus.co.uk/contact/" },
];

const SERVICES_ITEM = "Services";
const PORTFOLIOS_ITEM = "Portfolios";
const PORTFOLIOS_HREF = "https://xoomplus.co.uk/projects/";
const PILL_PAD = "px-4 py-2";

/** Two cards side-by-side — slightly under sticky nav width */
const PORTFOLIOS_PANEL_WIDTH = "w-[min(100vw-1.5rem,36rem)]";

/**
 * Desktop center nav: shared pill hover; Services + Portfolios open mega menus.
 */
export function DesktopNavItems({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center gap-1 type-nav text-muted-foreground transition duration-200 lg:flex",
        className,
      )}
    >
      {LEFT_LINKS.map((item) => (
        <NavPillLink
          key={item.name}
          item={item}
          hovered={hovered}
          onHover={setHovered}
        />
      ))}

      <Menu setActive={setActive} active={active}>
        <MegaTrigger
          label={SERVICES_ITEM}
          hovered={hovered}
          onHover={setHovered}
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item={SERVICES_ITEM}
            href={servicesMegaFeatured.href}
            triggerClassName="relative z-20"
            matchNavWidth
          >
            <ServicesMegaPanel open={active === SERVICES_ITEM} />
          </MenuItem>
        </MegaTrigger>

        <MegaTrigger
          label={PORTFOLIOS_ITEM}
          hovered={hovered}
          onHover={setHovered}
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item={PORTFOLIOS_ITEM}
            href={PORTFOLIOS_HREF}
            triggerClassName="relative z-20"
            panelClassName={PORTFOLIOS_PANEL_WIDTH}
          >
            <PortfoliosMegaPanel />
          </MenuItem>
        </MegaTrigger>
      </Menu>

      {RIGHT_LINKS.map((item) => (
        <NavPillLink
          key={item.name}
          item={item}
          hovered={hovered}
          onHover={setHovered}
        />
      ))}
    </motion.div>
  );
}

function MegaTrigger({
  label,
  hovered,
  onHover,
  children,
}: {
  label: string;
  hovered: string | null;
  onHover: (name: string) => void;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("relative inline-flex items-center rounded-full", PILL_PAD)}
      onMouseEnter={() => onHover(label)}
    >
      {hovered === label ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute inset-0 rounded-full bg-hover/80"
        />
      ) : null}
      {children}
    </div>
  );
}

function NavPillLink({
  item,
  hovered,
  onHover,
}: {
  item: NavLink;
  hovered: string | null;
  onHover: (name: string) => void;
}) {
  return (
    <a
      href={item.link}
      onMouseEnter={() => onHover(item.name)}
      className={cn(
        "relative inline-flex items-center rounded-full text-foreground/70 transition-colors hover:text-foreground",
        PILL_PAD,
      )}
    >
      {hovered === item.name ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute inset-0 rounded-full bg-hover/80"
        />
      ) : null}
      <span className="relative z-20">{item.name}</span>
    </a>
  );
}

/**
 * 3-column Services mega: parents | child links | featured — tight columns, no empty 1fr gap.
 */
function ServicesMegaPanel({ open }: { open: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open]);

  const activeColumn =
    servicesMegaColumns[activeIndex] ?? servicesMegaColumns[0];

  return (
    <div
      className="grid w-full grid-cols-1 gap-0 lg:grid-cols-[minmax(13.5rem,1.05fr)_minmax(14rem,1.2fr)_minmax(12rem,0.95fr)]"
      role="region"
      aria-label="Services"
    >
      {/* Column 1 — parent categories (real category hrefs from reference) */}
      <div className="flex flex-col gap-1 p-3.5 sm:p-4">
        {servicesMegaColumns.map((column, index) => {
          const isActive = index === activeIndex;
          return (
            <a
              key={column.href}
              href={column.href}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                isActive
                  ? "bg-hover text-hover-foreground"
                  : "text-foreground hover:bg-muted/60",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[0.9rem] font-semibold leading-snug tracking-[-0.02em]">
                  {column.title}
                </span>
                <span className="mt-0.5 block text-[0.72rem] leading-snug text-muted-foreground">
                  {CATEGORY_TAGLINES[column.title] ?? "Explore services"}
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isActive
                    ? "border-accent/40 bg-background text-accent"
                    : "border-border bg-background/80 text-muted-foreground",
                )}
              >
                <ArrowUpRight className="size-3.5" />
              </span>
            </a>
          );
        })}
      </div>

      {/* Column 2 — active category child links */}
      <div className="border-t border-border/70 p-3.5 sm:p-4 lg:border-t-0 lg:border-l lg:pl-3 lg:pr-3">
        <ul className="flex flex-col gap-0.5">
          {activeColumn.links.map((link) => (
            <li key={link.href}>
              <HoveredLink
                href={link.href}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[0.875rem] text-foreground/80 hover:bg-muted/40 hover:text-foreground"
              >
                <span
                  className="inline-flex size-[1.05rem] shrink-0 items-center justify-center text-primary [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{
                    __html: themeIconSvg(link.iconSvg),
                  }}
                />
                <span className="leading-snug">{link.label}</span>
              </HoveredLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3 — featured panel */}
      <div className="flex flex-col border-t border-border/70 p-4 sm:p-4 lg:border-t-0 lg:border-l">
        <h3 className="font-display text-base font-semibold leading-snug tracking-[-0.02em] text-foreground">
          {servicesMegaFeatured.title}
        </h3>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">
          {servicesMegaFeatured.description}
        </p>
        <div className="mt-4 pt-1 lg:mt-auto lg:pt-6">
          <HoverLift y={-3} scale={1.04} className="inline-flex">
            <a
              href={servicesMegaFeatured.href}
              aria-label={`${servicesMegaFeatured.title} — view services`}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-accent/50 hover:text-accent"
            >
              <ArrowUpRight className="size-4" />
            </a>
          </HoverLift>
        </div>
      </div>
    </div>
  );
}

/** Two featured projects in one row from landing portfolio data. */
function PortfoliosMegaPanel() {
  const featured = portfolioProjects.slice(0, 2);

  return (
    <div className="flex w-full flex-col gap-3 p-3.5 sm:p-4" role="region" aria-label="Portfolios">
      <div className="grid grid-cols-2 gap-3">
        {featured.map((project) => (
          <a
            key={project.id}
            href={project.href}
            className="group block min-w-0 overflow-hidden rounded-xl border border-border/60 bg-background/40 transition-colors hover:border-accent/40 hover:bg-muted/30"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- remote Unsplash URLs from portfolio data */}
            <img
              src={project.image}
              alt={project.imageAlt}
              width={640}
              height={360}
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="flex items-start justify-between gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold leading-snug text-foreground">
                  {project.title}
                </p>
                <p className="mt-0.5 truncate text-[0.7rem] text-muted-foreground">
                  {project.category}
                </p>
              </div>
              <span
                aria-hidden
                className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-accent/50 group-hover:text-accent"
              >
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>

      <a
        href={portfolioSectionCopy.exploreCta.href}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-center text-[0.8rem] font-medium text-foreground/80 transition-colors hover:bg-muted/40 hover:text-foreground"
      >
        {portfolioSectionCopy.exploreCta.label}
        <ArrowUpRight className="size-3.5" />
      </a>
    </div>
  );
}
