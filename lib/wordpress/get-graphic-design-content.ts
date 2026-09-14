import {
  WP_GRAPHIC_DESIGN_PAGE_ID,
  WP_REST,
} from "./config";

export type GraphicDesignHeroContent = {
  eyebrow: string;
  headline: string;
  body: string;
};

export type GraphicDesignServicesIntro = {
  eyebrow: string;
  title: string;
  body: string;
};

export type GraphicDesignPageContent = {
  hero: GraphicDesignHeroContent;
  servicesIntro: GraphicDesignServicesIntro;
};

type WpPage = {
  id: number;
  title?: { rendered?: string };
  content?: { rendered?: string };
};

function decodeEntities(input: string): string {
  return input
    .replace(/&#8217;|&rsquo;|’/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, (match) => {
      const code = Number(match.slice(2, -1));
      return Number.isFinite(code) ? String.fromCharCode(code) : match;
    });
}

function stripTags(input: string): string {
  return decodeEntities(
    input
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function firstMatch(html: string, pattern: RegExp): string {
  const match = pattern.exec(html);
  return match?.[1] ? stripTags(match[1]) : "";
}

/**
 * Parse Elementor hero + Our Services intro from WP page 2417 HTML.
 */
export function parseGraphicDesignHtml(html: string): GraphicDesignPageContent {
  const eyebrow = firstMatch(
    html,
    /<p class="elementor-heading-title[^"]*">([\s\S]*?)<\/p>/i,
  );

  const headline = firstMatch(
    html,
    /<h1 class="elementor-heading-title[^"]*">([\s\S]*?)<\/h1>/i,
  );

  const body = firstMatch(
    html,
    /data-widget_type="text-editor\.default">\s*([\s\S]*?)\s*<\/div>/i,
  );

  const servicesEyebrow = firstMatch(
    html,
    /<div class="sub-title[^"]*">\s*<span>([\s\S]*?)<\/span>/i,
  );

  const servicesTitle = firstMatch(
    html,
    /<div class="section-title-area">[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i,
  );

  const servicesBody = firstMatch(
    html,
    /<div class="section-title-area">[\s\S]*?<h2[^>]*>[\s\S]*?<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
  );

  if (!eyebrow || !headline || !body) {
    throw new Error("Failed to parse graphic design hero from WordPress HTML");
  }

  if (!servicesEyebrow || !servicesTitle || !servicesBody) {
    throw new Error(
      "Failed to parse graphic design services intro from WordPress HTML",
    );
  }

  return {
    hero: {
      eyebrow,
      headline,
      body,
    },
    servicesIntro: {
      eyebrow: servicesEyebrow,
      title: servicesTitle,
      body: servicesBody,
    },
  };
}

/**
 * Fetch Graphic Design Solutions content from WordPress page 2417.
 */
export async function getGraphicDesignPageContent(): Promise<GraphicDesignPageContent> {
  const url = `${WP_REST}/pages/${WP_GRAPHIC_DESIGN_PAGE_ID}?_fields=id,title,content`;
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch graphic design page: ${res.status}`);
  }

  const page = (await res.json()) as WpPage;
  const html = page.content?.rendered ?? "";
  if (!html) {
    throw new Error("Graphic design page content was empty");
  }

  return parseGraphicDesignHtml(html);
}
