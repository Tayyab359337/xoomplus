import type { Metadata } from "next";

import { WP_ORIGIN } from "@/lib/wordpress/config";

const SITE_URL = WP_ORIGIN;
const LOGO_URL = `${SITE_URL}/wp-content/uploads/2025/08/Xoom-Black-logo-png.webp`;

export const HOMEPAGE_SEO = {
  title: "Xoomplus - Digital Marketing & Web Development Agency",
  description:
    "Grow your businesses with Xoomplus. We deliver expert digital marketing, SEO, web development, and creative solutions to boost traffic and conversions.",
  canonical: `${SITE_URL}/`,
  siteName: "Xoomplus",
  locale: "en_US",
  language: "en-US",
  modifiedTime: "2026-09-11T08:53:45+00:00",
  publishedTime: "2024-11-10T02:49:46+00:00",
  publisherFacebook: "https://www.facebook.com/xoomplus1/",
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

export const homepageMetadata: Metadata = {
  title: {
    absolute: HOMEPAGE_SEO.title,
  },
  description: HOMEPAGE_SEO.description,
  alternates: {
    canonical: HOMEPAGE_SEO.canonical,
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
    locale: HOMEPAGE_SEO.locale,
    url: HOMEPAGE_SEO.canonical,
    siteName: HOMEPAGE_SEO.siteName,
    title: HOMEPAGE_SEO.title,
    description: HOMEPAGE_SEO.description,
    modifiedTime: HOMEPAGE_SEO.modifiedTime,
    images: [
      {
        url: HOMEPAGE_SEO.ogImage.url,
        width: HOMEPAGE_SEO.ogImage.width,
        height: HOMEPAGE_SEO.ogImage.height,
        type: HOMEPAGE_SEO.ogImage.type,
        alt: HOMEPAGE_SEO.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOMEPAGE_SEO.title,
    description: HOMEPAGE_SEO.description,
    images: [HOMEPAGE_SEO.ogImage.url],
  },
  other: {
    "article:publisher": HOMEPAGE_SEO.publisherFacebook,
    "twitter:label1": "Est. reading time",
    "twitter:data1": "2 minutes",
  },
};

/** Yoast-compatible JSON-LD graph for the homepage. */
export function getHomepageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/`,
        url: `${SITE_URL}/`,
        name: HOMEPAGE_SEO.title,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        primaryImageOfPage: {
          "@id": `${SITE_URL}/#primaryimage`,
        },
        image: {
          "@id": `${SITE_URL}/#primaryimage`,
        },
        thumbnailUrl: LOGO_URL,
        datePublished: HOMEPAGE_SEO.publishedTime,
        dateModified: HOMEPAGE_SEO.modifiedTime,
        description: HOMEPAGE_SEO.description,
        breadcrumb: {
          "@id": `${SITE_URL}/#breadcrumb`,
        },
        inLanguage: HOMEPAGE_SEO.language,
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [`${SITE_URL}/`],
          },
        ],
      },
      {
        "@type": "ImageObject",
        inLanguage: HOMEPAGE_SEO.language,
        "@id": `${SITE_URL}/#primaryimage`,
        url: LOGO_URL,
        contentUrl: LOGO_URL,
        width: HOMEPAGE_SEO.ogImage.width,
        height: HOMEPAGE_SEO.ogImage.height,
        caption: "Logo",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb`,
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
            name: "Xoomplus",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: HOMEPAGE_SEO.siteName,
        description: "Digital marketing Agency",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/?s={search_term_string}`,
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              valueRequired: true,
              valueName: "search_term_string",
            },
          },
        ],
        inLanguage: HOMEPAGE_SEO.language,
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: HOMEPAGE_SEO.siteName,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          inLanguage: HOMEPAGE_SEO.language,
          "@id": `${SITE_URL}/#/schema/logo/image/`,
          url: LOGO_URL,
          contentUrl: LOGO_URL,
          width: HOMEPAGE_SEO.ogImage.width,
          height: HOMEPAGE_SEO.ogImage.height,
          caption: HOMEPAGE_SEO.siteName,
        },
        image: {
          "@id": `${SITE_URL}/#/schema/logo/image/`,
        },
        sameAs: [...HOMEPAGE_SEO.sameAs],
      },
    ],
  };
}
