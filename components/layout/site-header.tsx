"use client";

import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DesktopNavItems } from "@/components/layout/desktop-nav-items";
import {
  NavBody,
  Navbar,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

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
      <Navbar className="hidden lg:block" data-nav-entrance>
        <NavBody>
          <BrandMark />
          <DesktopNavItems />
          <div className="relative z-20 flex items-center gap-2">
            <ThemeToggle />
            <NavbarButton
              href="https://xoomplus.co.uk/appointment-booking/"
              variant="primary"
            >
              Get a Quote
            </NavbarButton>
          </div>
        </NavBody>
      </Navbar>

      <div data-nav-entrance>
        <MobileNav />
      </div>
    </>
  );
}
