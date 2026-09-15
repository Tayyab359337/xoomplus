"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";

import { scrollToCurrentHash } from "@/lib/navigation/hash-scroll";
import { isAppRouteHref, mapWpHref } from "@/lib/wordpress/urls";
import { cn } from "@/lib/utils";

type AppLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  children?: ReactNode;
  /** Prefetch Next.js routes (default true for Link). */
  prefetch?: boolean;
};

function handleSameRouteHashClick(
  event: MouseEvent<HTMLAnchorElement>,
  mapped: string,
  userOnClick?: AppLinkProps["onClick"],
) {
  userOnClick?.(event);
  if (event.defaultPrevented) return;
  if (typeof window === "undefined") return;

  let url: URL;
  try {
    url = new URL(mapped, window.location.origin);
  } catch {
    return;
  }

  if (!url.hash) return;

  const sameRoute =
    url.pathname === window.location.pathname &&
    url.search === window.location.search;

  if (!sameRoute) return;

  event.preventDefault();
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (current !== next) {
    window.history.pushState(null, "", next);
  }
  scrollToCurrentHash();
}

/**
 * Internal paths → Next.js `<Link>` (client SPA navigation, no full reload).
 * External / tel / mailto → native `<a>`.
 * Same-page hash links update the URL and scroll without a full reload.
 */
export function AppLink({
  href,
  children,
  className,
  prefetch,
  onClick,
  ...rest
}: AppLinkProps) {
  const mapped = mapWpHref(href);

  if (isAppRouteHref(mapped)) {
    return (
      <Link
        href={mapped}
        prefetch={prefetch}
        className={cn(className)}
        onClick={(event) => handleSameRouteHashClick(event, mapped, onClick)}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={mapped}
      className={cn(className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
}
