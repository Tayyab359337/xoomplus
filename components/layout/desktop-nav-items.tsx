"use client";

import { useState } from "react";
import { motion } from "motion/react";

import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import {
  servicesMegaColumns,
  servicesMegaFeatured,
} from "@/lib/data/services-mega-menu";
import { cn } from "@/lib/utils";

type NavLink = { name: string; link: string };

const LEFT_LINKS: NavLink[] = [{ name: "Work", link: "#work" }];
const RIGHT_LINKS: NavLink[] = [
  { name: "Studio", link: "#studio" },
  { name: "Contact", link: "#contact" },
];

const SERVICES_ITEM = "Services";

/**
 * Desktop center nav: shared pill hover on every item; Services opens Aceternity mega menu.
 * Replaces Approach with Services (mega) — mobile nav is unchanged.
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
        <div
          className="relative"
          onMouseEnter={() => setHovered(SERVICES_ITEM)}
        >
          {hovered === SERVICES_ITEM && (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 h-full w-full rounded-full bg-hover/80"
            />
          )}
          <MenuItem
            setActive={setActive}
            active={active}
            item={SERVICES_ITEM}
            href={servicesMegaFeatured.href}
            triggerClassName="relative z-20 px-4 py-2"
          >
            <ServicesMegaPanel />
          </MenuItem>
        </div>
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
      className="relative px-4 py-2 text-foreground/70 transition-colors hover:text-foreground"
    >
      {hovered === item.name && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 h-full w-full rounded-full bg-hover/80"
        />
      )}
      <span className="relative z-20">{item.name}</span>
    </a>
  );
}

function ServicesMegaPanel() {
  return (
    <div className="flex gap-8 text-sm">
      <ProductItem
        title={servicesMegaFeatured.title}
        description={servicesMegaFeatured.description}
        href={servicesMegaFeatured.href}
        src={servicesMegaFeatured.image}
      />
      {servicesMegaColumns.map((column) => (
        <div key={column.href} className="flex min-w-[11rem] flex-col gap-3">
          <HoveredLink
            href={column.href}
            className="font-medium text-foreground hover:text-accent"
          >
            {column.title}
          </HoveredLink>
          <ul className="flex flex-col gap-2">
            {column.links.map((link) => (
              <li key={link.href}>
                <HoveredLink
                  href={link.href}
                  className="flex items-center gap-2"
                >
                  <span
                    className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                    dangerouslySetInnerHTML={{ __html: link.iconSvg }}
                  />
                  <span>{link.label}</span>
                </HoveredLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
