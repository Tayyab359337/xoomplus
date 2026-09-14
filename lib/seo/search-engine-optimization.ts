import type { Metadata } from "next";

import { WP_ORIGIN } from "@/lib/wordpress/config";

const SITE_URL = WP_ORIGIN;
const PAGE_PATH = "/digital-marketing/search-engine-optimization/";
const LOGO_URL = `${SITE_URL}/wp-content/uploads/2025/08/Xoom-Black-logo-png.webp`;
const HERO_IMAGE_URL = `${SITE_URL}/wp-content/uploads/2025/08/seo-services.webp`;

/** Yoast + on-page Product schema from WP page 3062. OG image is seo-services.webp. */
export const SEO_SERVICES_SEO = {
  title: "SEO Services | Xoom Plus Search Engine Experts",
  description:
    "Improve your website rankings and visibility with Xoom Plus SEO services, including on-page, off-page, and technical SEO strategies.",
  canonical: `${SITE_URL}${PAGE_PATH}`,
  siteName: "Xoomplus",
  locale: "en_US",
  language: "en-US",
  modifiedTime: "2026-07-01T07:18:49+00:00",
  publishedTime: "2025-08-20T07:59:24+00:00",
  publisherFacebook: "https://www.facebook.com/xoomplus1/",
  readingTime: "7 minutes",
  productName: "Search Engine Optimisation(SEO)",
  productDescription:
    "XoomPlus offers comprehensive SEO services for businesses across the UK, helping brands achieve stronger search rankings, increased organic traffic, and long-term online authority. Their SEO approach combines technical optimisation, keyword research, on-page enhancements, link building, local SEO, and content strategy to improve website performance and attract customers actively searching for relevant products and services.",
  productImage: HERO_IMAGE_URL,
  lowPrice: "200",
  highPrice: "1000",
  offerCount: "3",
  priceCurrency: "GBP",
  ogImage: {
    url: HERO_IMAGE_URL,
    width: 600,
    height: 400,
    type: "image/webp" as const,
    alt: "SEO Service",
  },
  sameAs: [
    "https://www.facebook.com/xoomplus1/",
    "https://www.instagram.com/xoomplus1/",
    "https://pk.linkedin.com/company/xoomplus",
  ],
} as const;

export const searchEngineOptimizationMetadata: Metadata = {
  title: {
    absolute: SEO_SERVICES_SEO.title,
  },
  description: SEO_SERVICES_SEO.description,
  alternates: {
    canonical: SEO_SERVICES_SEO.canonical,
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    type: "article",
    locale: SEO_SERVICES_SEO.locale,
    url: SEO_SERVICES_SEO.canonical,
    siteName: SEO_SERVICES_SEO.siteName,
    title: SEO_SERVICES_SEO.title,
    description: SEO_SERVICES_SEO.description,
    modifiedTime: SEO_SERVICES_SEO.modifiedTime,
    images: [
      {
        url: SEO_SERVICES_SEO.ogImage.url,
        width: SEO_SERVICES_SEO.ogImage.width,
        height: SEO_SERVICES_SEO.ogImage.height,
        type: SEO_SERVICES_SEO.ogImage.type,
        alt: SEO_SERVICES_SEO.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_SERVICES_SEO.title,
    description: SEO_SERVICES_SEO.description,
    images: [SEO_SERVICES_SEO.ogImage.url],
  },
  other: {
    "article:publisher": SEO_SERVICES_SEO.publisherFacebook,
    "twitter:label1": "Est. reading time",
    "twitter:data1": SEO_SERVICES_SEO.readingTime,
  },
};

/** WebPage, BreadcrumbList, Organization, Product/AggregateOffer — from WP Yoast + on-page JSON-LD. */
export function getSeoServicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": SEO_SERVICES_SEO.canonical,
        url: SEO_SERVICES_SEO.canonical,
        name: SEO_SERVICES_SEO.title,
        description: SEO_SERVICES_SEO.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SEO_SERVICES_SEO.canonical}#product` },
        primaryImageOfPage: {
          "@id": `${SEO_SERVICES_SEO.canonical}#primaryimage`,
        },
        image: { "@id": `${SEO_SERVICES_SEO.canonical}#primaryimage` },
        thumbnailUrl: SEO_SERVICES_SEO.productImage,
        datePublished: SEO_SERVICES_SEO.publishedTime,
        dateModified: SEO_SERVICES_SEO.modifiedTime,
        inLanguage: SEO_SERVICES_SEO.language,
        breadcrumb: { "@id": `${SEO_SERVICES_SEO.canonical}#breadcrumb` },
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [SEO_SERVICES_SEO.canonical],
          },
        ],
      },
      {
        "@type": "ImageObject",
        inLanguage: SEO_SERVICES_SEO.language,
        "@id": `${SEO_SERVICES_SEO.canonical}#primaryimage`,
        url: SEO_SERVICES_SEO.productImage,
        contentUrl: SEO_SERVICES_SEO.productImage,
        width: SEO_SERVICES_SEO.ogImage.width,
        height: SEO_SERVICES_SEO.ogImage.height,
        caption: "SEO Service",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SEO_SERVICES_SEO.canonical}#breadcrumb`,
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
            name: "Digital Marketing",
            item: `${SITE_URL}/digital-marketing/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "SEO Services",
            item: SEO_SERVICES_SEO.canonical,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SEO_SERVICES_SEO.siteName,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          inLanguage: SEO_SERVICES_SEO.language,
          "@id": `${SITE_URL}/#/schema/logo/image/`,
          url: LOGO_URL,
          contentUrl: LOGO_URL,
          width: 1217,
          height: 281,
          caption: SEO_SERVICES_SEO.siteName,
        },
        image: {
          "@id": `${SITE_URL}/#/schema/logo/image/`,
        },
        sameAs: [...SEO_SERVICES_SEO.sameAs],
      },
      {
        "@type": "Product",
        "@id": `${SEO_SERVICES_SEO.canonical}#product`,
        name: SEO_SERVICES_SEO.productName,
        image: SEO_SERVICES_SEO.productImage,
        description: SEO_SERVICES_SEO.productDescription,
        brand: {
          "@type": "Brand",
          name: SEO_SERVICES_SEO.siteName,
        },
        offers: {
          "@type": "AggregateOffer",
          url: SEO_SERVICES_SEO.canonical,
          priceCurrency: SEO_SERVICES_SEO.priceCurrency,
          lowPrice: SEO_SERVICES_SEO.lowPrice,
          highPrice: SEO_SERVICES_SEO.highPrice,
          offerCount: SEO_SERVICES_SEO.offerCount,
        },
      },
    ],
  };
}
