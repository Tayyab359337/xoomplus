import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { isAppRouteHref, mapWpHref } from "@/lib/wordpress/urls";
import { cn } from "@/lib/utils";

type AppLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  children?: ReactNode;
  /** Prefetch Next.js routes (default true for Link). */
  prefetch?: boolean;
};

/**
 * Internal paths → Next.js `<Link>` (client SPA navigation, no full reload).
 * External / hash / tel / mailto → native `<a>`.
 */
export function AppLink({
  href,
  children,
  className,
  prefetch,
  ...rest
}: AppLinkProps) {
  const mapped = mapWpHref(href);

  if (isAppRouteHref(mapped)) {
    return (
      <Link
        href={mapped}
        prefetch={prefetch}
        className={cn(className)}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <a href={mapped} className={cn(className)} {...rest}>
      {children}
    </a>
  );
}
