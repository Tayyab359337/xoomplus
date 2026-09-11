"use client";

import { MobileNav } from "@/components/layout/mobile-nav";
import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DesktopNavItems } from "@/components/layout/desktop-nav-items";
import {
  NavBody,
  Navbar,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

/**
 * Desktop: Aceternity Resizable Navbar.
 * Mobile (< lg): optimized custom nav (frost + readable panel).
 */
export function SiteHeader() {
  return (
    <>
      <Navbar className="hidden lg:block" data-nav-entrance>
        <NavBody>
          <BrandMark height={30} />
          <DesktopNavItems />
          <div className="relative z-20 flex items-center gap-2">
            <ThemeToggle />
            <NavbarButton
              href="/appointment-booking/"
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
