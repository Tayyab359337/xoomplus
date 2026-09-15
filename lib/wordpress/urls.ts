import { WP_ORIGIN } from "./config";

/**
 * Map WordPress absolute URLs to Next.js pathnames when on the same origin.
 * External / tel / mailto / hash links are returned unchanged.
 */
export function mapWpHref(href: string): string {
  if (!href) return href;
  if (
    href.startsWith("#") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("/")
  ) {
    return href;
  }

  try {
    const url = new URL(href);
    if (url.origin === WP_ORIGIN) {
      const path = `${url.pathname}${url.search}${url.hash}`;
      return path === "" ? "/" : path;
    }
  } catch {
    return href;
  }

  return href;
}

export function isInternalHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}

/**
 * True for same-app pathnames that should use Next.js `<Link>` (SPA navigation).
 * False for hash / tel / mailto / external absolute URLs (use `<a>`).
 */
export function isAppRouteHref(href: string): boolean {
  if (!href) return false;
  if (
    href.startsWith("#") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("sms:") ||
    href.startsWith("blob:") ||
    href.startsWith("data:")
  ) {
    return false;
  }
  const mapped = mapWpHref(href);
  return mapped.startsWith("/") && !mapped.startsWith("//");
}
