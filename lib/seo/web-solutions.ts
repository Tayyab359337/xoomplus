import type { Metadata } from "next";

import { WP_ORIGIN } from "@/lib/wordpress/config";

const SITE_URL = WP_ORIGIN;
const PAGE_PATH = "/web-solutions/";
const LOGO_URL = `${SITE_URL}/wp-content/uploads/2025/08/Xoom-Black-logo-png.webp`;
const HERO_SVG_URL = `${SITE_URL}/wp-content/uploads/2025/08/web-solutions.svg`;

export const WEB_SOLUTIONS_SEO = {
  title: "Web Solutions | Xoom Plus Website Development Agency",
  description:
    "Build your online presence with Xoom Plus web solutions, offering website design, e-commerce, hosting, and support.",
  canonical: `${SITE_URL}${PAGE_PATH}`,
  siteName: "Xoomplus",
  locale: "en_US",
  language: "en-US",
  modifiedTime: "2026-07-01T07:23:08+00:00",
  publishedTime: "2025-08-18T09:23:00+00:00",
  publisherFacebook: "https://www.facebook.com/xoomplus1/",
  readingTime: "10 minutes",
  productName: "Web Solutions Services",
  productDescription:
    "XoomPlus web solutions cover eCommerce development, WordPress, custom websites, Shopify stores, website maintenance, and hosting all built to convert visitors into customers and grow your business online.",
  productImage: HERO_SVG_URL,
  lowPrice: "1000",
  highPrice: "2000",
  offerCount: "100",
  priceCurrency: "GBP",
  ogImage: {
    url: LOGO_URL,
    width: 1217,
    height: 281,
    type: "image/webp" as const,
    alt: "Xoomplus",
  },
  sameAs: [
    "https://www.facebook.com/xoomplus1/",
    "https://www.instagram.com/xoomplus1/",
    "https://pk.linkedin.com/company/xoomplus",
  ],
} as const;

export const webSolutionsMetadata: Metadata = {
  title: {
    absolute: WEB_SOLUTIONS_SEO.title,
  },
  description: WEB_SOLUTIONS_SEO.description,
  alternates: {
    canonical: WEB_SOLUTIONS_SEO.canonical,
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    locale: WEB_SOLUTIONS_SEO.locale,
    type: "website",
    title: WEB_SOLUTIONS_SEO.title,
    description: WEB_SOLUTIONS_SEO.description,
    url: WEB_SOLUTIONS_SEO.canonical,
    siteName: WEB_SOLUTIONS_SEO.siteName,
    images: [
      {
        url: WEB_SOLUTIONS_SEO.ogImage.url,
        width: WEB_SOLUTIONS_SEO.ogImage.width,
        height: WEB_SOLUTIONS_SEO.ogImage.height,
        alt: WEB_SOLUTIONS_SEO.ogImage.alt,
        type: WEB_SOLUTIONS_SEO.ogImage.type,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: WEB_SOLUTIONS_SEO.title,
    description: WEB_SOLUTIONS_SEO.description,
    images: [WEB_SOLUTIONS_SEO.ogImage.url],
  },
};

export function getWebSolutionsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${WEB_SOLUTIONS_SEO.canonical}#webpage`,
        url: WEB_SOLUTIONS_SEO.canonical,
        name: WEB_SOLUTIONS_SEO.title,
        description: WEB_SOLUTIONS_SEO.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: WEB_SOLUTIONS_SEO.language,
        datePublished: WEB_SOLUTIONS_SEO.publishedTime,
        dateModified: WEB_SOLUTIONS_SEO.modifiedTime,
        breadcrumb: { "@id": `${WEB_SOLUTIONS_SEO.canonical}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${WEB_SOLUTIONS_SEO.canonical}#breadcrumb`,
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
            name: "Web Solutions",
            item: WEB_SOLUTIONS_SEO.canonical,
          },
        ],
      },
      {
        "@type": "Product",
        "@id": `${WEB_SOLUTIONS_SEO.canonical}#product`,
        name: WEB_SOLUTIONS_SEO.productName,
        image: WEB_SOLUTIONS_SEO.productImage,
        description: WEB_SOLUTIONS_SEO.productDescription,
        brand: {
          "@type": "Brand",
          name: WEB_SOLUTIONS_SEO.siteName,
        },
        offers: {
          "@type": "AggregateOffer",
          url: WEB_SOLUTIONS_SEO.canonical,
          priceCurrency: WEB_SOLUTIONS_SEO.priceCurrency,
          lowPrice: WEB_SOLUTIONS_SEO.lowPrice,
          highPrice: WEB_SOLUTIONS_SEO.highPrice,
          offerCount: WEB_SOLUTIONS_SEO.offerCount,
        },
      },
    ],
  };
}

