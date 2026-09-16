import {
  webSolutionsFallbackHero,
  webSolutionsSubServicesCopy,
  type WebSolutionsHeroCopy,
  type WebSolutionsServicesIntro,
} from "@/lib/data/web-solutions";
import { WP_REST, WP_WEB_SOLUTIONS_PAGE_ID } from "./config";

export type WebSolutionsPageContent = {
  hero: WebSolutionsHeroCopy;
  servicesIntro: WebSolutionsServicesIntro;
};

type WpPage = { content?: { rendered?: string } };

function text(value: string) {
  return value
    .replace(/<br\s*\/?>(\s*)/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function first(html: string, pattern: RegExp) {
  const match = pattern.exec(html);
  return match?.[1] ? text(match[1]) : "";
}

export function parseWebSolutionsHtml(html: string): WebSolutionsPageContent {
  const headline = first(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || webSolutionsFallbackHero.headline;
  const body = first(html, /data-widget_type="text-editor\.default">([\s\S]*?)<\/div>/i) || webSolutionsFallbackHero.body;
  const eyebrow = first(html, /<p[^>]*class="[^\"]*elementor-heading-title[^\"]*"[^>]*>([\s\S]*?)<\/p>/i) || webSolutionsFallbackHero.eyebrow;
  const title = first(html, /<div[^>]*class="[^\"]*section-title-area[^\"]*"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i) || webSolutionsSubServicesCopy.title;
  const introBody = first(html, /<div[^>]*class="[^\"]*section-title-area[^\"]*"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) || webSolutionsSubServicesCopy.body;

  return {
    hero: { eyebrow, headline, body },
    servicesIntro: { eyebrow: webSolutionsSubServicesCopy.eyebrow, title, body: introBody },
  };
}

export async function getWebSolutionsPageContent(): Promise<WebSolutionsPageContent> {
  try {
    const response = await fetch(`${WP_REST}/pages/${WP_WEB_SOLUTIONS_PAGE_ID}?_fields=content`, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error("Unable to fetch Web Solutions content");
    return parseWebSolutionsHtml(((await response.json()) as WpPage).content?.rendered ?? "");
  } catch {
    return { hero: webSolutionsFallbackHero, servicesIntro: webSolutionsSubServicesCopy };
  }
}
