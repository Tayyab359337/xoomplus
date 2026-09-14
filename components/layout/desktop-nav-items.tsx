"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { HoverLift } from "@/components/animations/HoverLift";
import { LocationMegaMenu } from "@/components/locations/location-mega-menu";
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
import { mapWpHref } from "@/lib/wordpress/urls";
import { cn } from "@/lib/utils";

type NavLink = { name: string; link: string };

/** Labels/hrefs from reference/xm-services-menu.html — relative for current host */
const LEFT_LINKS: NavLink[] = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "/about/" },
];
const RIGHT_LINKS: NavLink[] = [
  { name: "Blogs", link: "/blogs/" },
  { name: "Contact Us", link: "/contact/" },
];

const SERVICES_ITEM = "Services";
const PORTFOLIOS_ITEM = "Portfolios";
const LOCATIONS_ITEM = "Locations";
const PORTFOLIOS_HREF = "/projects/";
const LOCATIONS_HREF = "/locations/";
const PILL_PAD = "px-3 py-2.5 xl:px-4";

/** Two cards side-by-side — slightly under sticky nav width */
const PORTFOLIOS_PANEL_WIDTH = "w-[min(100vw-1.5rem,42rem)]";
const LOCATIONS_PANEL_WIDTH = "w-[min(100vw-1.5rem,32rem)]";

/**
 * Desktop center nav: shared pill hover; Services, Portfolios, and Locations open mega menus.
 */
export function DesktopNavItems({ className }: { className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center gap-0.5 overflow-visible whitespace-nowrap type-nav text-muted-foreground transition duration-200 lg:flex",
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
          onOpen={setActive}
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item={SERVICES_ITEM}
            href={mapWpHref(servicesMegaFeatured.href)}
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
          onOpen={setActive}
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

        <MegaTrigger
          label={LOCATIONS_ITEM}
          hovered={hovered}
          onHover={setHovered}
          onOpen={setActive}
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item={LOCATIONS_ITEM}
            href={LOCATIONS_HREF}
            triggerClassName="relative z-20"
            panelClassName={LOCATIONS_PANEL_WIDTH}
          >
            <LocationMegaMenu />
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
  onOpen,
  children,
}: {
  label: string;
  hovered: string | null;
  onHover: (name: string) => void;
  onOpen: (name: string) => void;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("relative inline-flex items-center rounded-full", PILL_PAD)}
      onMouseEnter={() => {
        onHover(label);
        onOpen(label);
      }}
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
      className="grid w-full grid-cols-1 gap-0 lg:grid-cols-[minmax(16rem,1.05fr)_minmax(17rem,1.25fr)_minmax(14rem,0.95fr)]"
      role="region"
      aria-label="Services"
    >
      {/* Column 1 — parent categories (real category hrefs from reference) */}
      <div className="flex flex-col gap-1.5 p-5 sm:p-6">
        {servicesMegaColumns.map((column, index) => {
          const isActive = index === activeIndex;
          return (
            <a
              key={column.href}
              href={mapWpHref(column.href)}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors",
                isActive
                  ? "bg-hover text-hover-foreground"
                  : "text-foreground hover:bg-muted/60",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[1.08rem] font-semibold leading-snug tracking-[-0.02em]">
                  {column.title}
                </span>
                <span className="mt-1 block text-[0.92rem] leading-snug text-muted-foreground">
                  {CATEGORY_TAGLINES[column.title] ?? "Explore services"}
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors",
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

      {/* Column 2 — active category child links (animate on parent hover) */}
      <div className="relative border-t border-border/70 p-5 sm:p-6 lg:border-t-0 lg:border-l lg:pl-5 lg:pr-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={activeColumn.href}
            className="flex flex-col gap-1"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.02, delayChildren: 0.01 },
              },
            }}
          >
            {activeColumn.links.map((link) => (
              <motion.li
                key={link.href}
                variants={{
                  hidden: { opacity: 0, x: 8 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.14, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <HoveredLink
                  href={mapWpHref(link.href)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-[1.02rem] text-foreground/80 hover:bg-muted/40 hover:text-foreground"
                >
                  <span
                    className="inline-flex size-[1.25rem] shrink-0 items-center justify-center text-primary [&>svg]:h-full [&>svg]:w-full"
                    dangerouslySetInnerHTML={{
                      __html: themeIconSvg(link.iconSvg),
                    }}
                  />
                  <span className="leading-snug">{link.label}</span>
                </HoveredLink>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      {/* Column 3 — featured panel */}
      <div className="flex flex-col border-t border-border/70 p-5 sm:p-6 lg:border-t-0 lg:border-l">
        <h3 className="font-display text-[1.2rem] font-semibold leading-snug tracking-[-0.02em] text-foreground">
          {servicesMegaFeatured.title}
        </h3>
        <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
          {servicesMegaFeatured.description}
        </p>
        <div className="mt-5 pt-1 lg:mt-auto lg:pt-8">
          <HoverLift y={-3} scale={1.04} className="inline-flex">
            <a
              href={mapWpHref(servicesMegaFeatured.href)}
              aria-label={`${servicesMegaFeatured.title} — view services`}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-accent/50 hover:text-accent"
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
    <div className="flex w-full flex-col gap-4 p-5 sm:p-6" role="region" aria-label="Portfolios">
      <div className="grid grid-cols-2 gap-4">
        {featured.map((project) => (
          <a
            key={project.id}
            href={project.href}
            className="group flex min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-border/50 bg-card p-3 text-card-foreground transition-colors hover:border-accent/35 hover:bg-card/90"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- remote Unsplash URLs from portfolio data */}
            <img
              src={project.image}
              alt={project.imageAlt}
              width={640}
              height={360}
              className="aspect-[16/10] w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="flex items-start justify-between gap-2 px-0.5 pb-0.5">
              <div className="min-w-0">
                <p className="truncate font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-foreground">
                  {project.title}
                </p>
                <p className="mt-1 truncate text-[0.95rem] text-muted-foreground">
                  {project.category}
                </p>
              </div>
              <span
                aria-hidden
                className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-accent/50 group-hover:text-accent"
              >
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>

      <a
        href={portfolioSectionCopy.exploreCta.href}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center text-[0.95rem] font-medium text-foreground/80 transition-colors hover:bg-muted/40 hover:text-foreground"
      >
        {portfolioSectionCopy.exploreCta.label}
        <ArrowUpRight className="size-3.5" />
      </a>
    </div>
  );
}
