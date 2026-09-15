import type { Metadata } from "next";

import { WP_ORIGIN } from "@/lib/wordpress/config";

const SITE_URL = WP_ORIGIN;
const PAGE_PATH = "/about/";
const LOGO_URL = `${SITE_URL}/wp-content/uploads/2025/08/Xoom-Black-logo-png.webp`;
const OG_IMAGE_URL = `${SITE_URL}/wp-content/uploads/2025/09/faq-overlay.webp`;

export const ABOUT_SEO = {
  title: "About Xoom Plus | Digital Marketing & Web Solutions Experts",
  description:
    "Learn about Xoom Plus, your trusted partner for digital marketing, web development, and design solutions to grow your business online.",
  canonical: `${SITE_URL}${PAGE_PATH}`,
  siteName: "Xoomplus",
  locale: "en_US",
  language: "en-US",
  modifiedTime: "2026-07-01T07:03:11+00:00",
  publishedTime: "2024-11-25T05:35:01+00:00",
  publisherFacebook: "https://www.facebook.com/xoomplus1/",
  readingTime: "1 minute",
  ogImage: {
    url: OG_IMAGE_URL,
    width: 370,
    height: 946,
    type: "image/webp" as const,
    alt: "Xoomplus",
  },
  sameAs: [
    "https://www.facebook.com/xoomplus1/",
    "https://www.instagram.com/xoomplus1/",
    "https://pk.linkedin.com/company/xoomplus",
  ],
} as const;

export const aboutMetadata: Metadata = {
  title: {
    absolute: ABOUT_SEO.title,
  },
  description: ABOUT_SEO.description,
  alternates: {
    canonical: ABOUT_SEO.canonical,
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
    locale: ABOUT_SEO.locale,
    url: ABOUT_SEO.canonical,
    siteName: ABOUT_SEO.siteName,
    title: ABOUT_SEO.title,
    description: ABOUT_SEO.description,
    modifiedTime: ABOUT_SEO.modifiedTime,
    images: [
      {
        url: ABOUT_SEO.ogImage.url,
        width: ABOUT_SEO.ogImage.width,
        height: ABOUT_SEO.ogImage.height,
        type: ABOUT_SEO.ogImage.type,
        alt: ABOUT_SEO.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_SEO.title,
    description: ABOUT_SEO.description,
    images: [ABOUT_SEO.ogImage.url],
  },
  other: {
    "article:publisher": ABOUT_SEO.publisherFacebook,
    "twitter:label1": "Est. reading time",
    "twitter:data1": ABOUT_SEO.readingTime,
  },
};

export function getAboutJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": ABOUT_SEO.canonical,
        url: ABOUT_SEO.canonical,
        name: ABOUT_SEO.title,
        description: ABOUT_SEO.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        primaryImageOfPage: {
          "@id": `${ABOUT_SEO.canonical}#primaryimage`,
        },
        image: { "@id": `${ABOUT_SEO.canonical}#primaryimage` },
        thumbnailUrl: ABOUT_SEO.ogImage.url,
        datePublished: ABOUT_SEO.publishedTime,
        dateModified: ABOUT_SEO.modifiedTime,
        inLanguage: ABOUT_SEO.language,
        breadcrumb: { "@id": `${ABOUT_SEO.canonical}#breadcrumb` },
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [ABOUT_SEO.canonical],
          },
        ],
      },
      {
        "@type": "ImageObject",
        inLanguage: ABOUT_SEO.language,
        "@id": `${ABOUT_SEO.canonical}#primaryimage`,
        url: ABOUT_SEO.ogImage.url,
        contentUrl: ABOUT_SEO.ogImage.url,
        width: ABOUT_SEO.ogImage.width,
        height: ABOUT_SEO.ogImage.height,
        caption: "Xoomplus",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${ABOUT_SEO.canonical}#breadcrumb`,
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
            name: "About Us",
            item: ABOUT_SEO.canonical,
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: ABOUT_SEO.siteName,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          inLanguage: ABOUT_SEO.language,
          "@id": `${SITE_URL}/#/schema/logo/image/`,
          url: LOGO_URL,
          contentUrl: LOGO_URL,
          width: 1217,
          height: 281,
          caption: ABOUT_SEO.siteName,
        },
        image: { "@id": `${SITE_URL}/#/schema/logo/image/` },
        sameAs: [...ABOUT_SEO.sameAs],
      },
    ],
  };
}
