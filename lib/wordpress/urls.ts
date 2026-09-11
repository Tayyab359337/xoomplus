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
