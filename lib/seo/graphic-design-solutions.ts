import type { Metadata } from "next";

import { WP_ORIGIN } from "@/lib/wordpress/config";

const SITE_URL = WP_ORIGIN;
const PAGE_PATH = "/graphic-design-solutions/";
const LOGO_URL = `${SITE_URL}/wp-content/uploads/2025/08/Xoom-Black-logo-png.webp`;

export const GRAPHIC_DESIGN_SEO = {
  title: "Graphic Design Solutions | Xoomplus",
  description:
    "Strategic graphic design for brands that need to look inevitable — identity, UI, campaigns, and print systems from Xoomplus.",
  canonical: `${SITE_URL}${PAGE_PATH}`,
  siteName: "Xoomplus",
  locale: "en_US",
  language: "en-US",
  ogImage: {
    url: LOGO_URL,
    width: 1217,
    height: 281,
    type: "image/webp" as const,
    alt: "Xoomplus",
  },
} as const;

export const graphicDesignSolutionsMetadata: Metadata = {
  title: {
    absolute: GRAPHIC_DESIGN_SEO.title,
  },
  description: GRAPHIC_DESIGN_SEO.description,
  alternates: {
    canonical: GRAPHIC_DESIGN_SEO.canonical,
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: GRAPHIC_DESIGN_SEO.locale,
    url: GRAPHIC_DESIGN_SEO.canonical,
    siteName: GRAPHIC_DESIGN_SEO.siteName,
    title: GRAPHIC_DESIGN_SEO.title,
    description: GRAPHIC_DESIGN_SEO.description,
    images: [
      {
        url: GRAPHIC_DESIGN_SEO.ogImage.url,
        width: GRAPHIC_DESIGN_SEO.ogImage.width,
        height: GRAPHIC_DESIGN_SEO.ogImage.height,
        type: GRAPHIC_DESIGN_SEO.ogImage.type,
        alt: GRAPHIC_DESIGN_SEO.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: GRAPHIC_DESIGN_SEO.title,
    description: GRAPHIC_DESIGN_SEO.description,
    images: [GRAPHIC_DESIGN_SEO.ogImage.url],
  },
};

/** Service page JSON-LD — mirrors homepage graph shape. */
export function getGraphicDesignJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${GRAPHIC_DESIGN_SEO.canonical}#webpage`,
        url: GRAPHIC_DESIGN_SEO.canonical,
        name: GRAPHIC_DESIGN_SEO.title,
        description: GRAPHIC_DESIGN_SEO.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${GRAPHIC_DESIGN_SEO.canonical}#service` },
        inLanguage: GRAPHIC_DESIGN_SEO.language,
        breadcrumb: { "@id": `${GRAPHIC_DESIGN_SEO.canonical}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${GRAPHIC_DESIGN_SEO.canonical}#service`,
        name: "Graphic Design Solutions",
        description: GRAPHIC_DESIGN_SEO.description,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "Worldwide",
        serviceType: "Graphic Design",
        url: GRAPHIC_DESIGN_SEO.canonical,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${GRAPHIC_DESIGN_SEO.canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Graphic Design Solutions",
            item: GRAPHIC_DESIGN_SEO.canonical,
          },
        ],
      },
    ],
  };
}
