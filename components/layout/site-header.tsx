"use client";

import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  NavBody,
  Navbar,
  NavbarButton,
  NavItems,
} from "@/components/ui/resizable-navbar";

const NAV_ITEMS = [
  { name: "Work", link: "#work" },
  { name: "Approach", link: "#approach" },
  { name: "Studio", link: "#studio" },
  { name: "Contact", link: "#contact" },
];

function BrandMark() {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-baseline gap-0 px-2 py-1.5 font-display text-xl tracking-tight text-foreground"
    >
      Xoom
      <span className="text-accent">plus</span>
    </Link>
  );
}

/**
 * Desktop: Aceternity Resizable Navbar.
 * Mobile (< lg): optimized custom nav (frost + readable panel).
 */
export function SiteHeader() {
  return (
    <>
      <Navbar className="hidden lg:block">
        <NavBody>
          <BrandMark />
          <NavItems items={NAV_ITEMS} />
          <div className="relative z-20 flex items-center gap-2">
            <ThemeToggle />
            <NavbarButton href="#contact" variant="primary">
              Start a project
            </NavbarButton>
          </div>
        </NavBody>
      </Navbar>

      <MobileNav />
    </>
  );
}
