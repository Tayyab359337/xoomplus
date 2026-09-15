import { WP_ORIGIN } from "./config";

const WP_UPLOAD_HOST_RE =
  /(?:https?:\/\/)?(?:www\.)?(xoomplus\.co\.uk|concisemedico\.co\.uk)(\/wp-content\/uploads\/[^\s"'<>]+)/i;

/**
 * Recover a canonical WordPress media URL from CDN-rewritten markup
 * (FastPixel `data-fpo-src`, percent-encoded paths, SVG placeholders).
 * Returns "" for data-URIs and URLs that are not WP uploads.
 */
export function unwrapWpMediaUrl(input: string | undefined | null): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed || trimmed.startsWith("data:")) return "";

  let decoded = trimmed;
  for (let i = 0; i < 4; i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  const encodedMatch = decoded.match(WP_UPLOAD_HOST_RE);
  if (encodedMatch) {
    const host = encodedMatch[1]!.toLowerCase();
    const path = encodedMatch[2]!.replace(/[?#].*$/, "");
    return `https://${host}${path}`;
  }

  if (
    /^https?:\/\//i.test(trimmed) &&
    /\/wp-content\/uploads\//i.test(trimmed) &&
    !/fastpixel/i.test(trimmed)
  ) {
    return trimmed.replace(/[?#].*$/, "");
  }

  return "";
}

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
