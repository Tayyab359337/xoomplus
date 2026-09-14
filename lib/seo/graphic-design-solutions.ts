import type { Metadata } from "next";

import { WP_ORIGIN } from "@/lib/wordpress/config";

const SITE_URL = WP_ORIGIN;
const PAGE_PATH = "/graphic-design-solutions/";
const LOGO_URL = `${SITE_URL}/wp-content/uploads/2025/08/Xoom-Black-logo-png.webp`;
const HERO_SVG_URL = `${SITE_URL}/wp-content/uploads/2025/08/Graphic-Design-Solutions.svg`;

/** Yoast + on-page Product schema from WP page 2417. OG image stays the site logo. */
export const GRAPHIC_DESIGN_SEO = {
  title: "Graphic Design Services | Xoom Plus Agency",
  description:
    "Enhance your brand identity with professional graphic design solutions by Xoom Plus, including logos, infographics, and print design.",
  canonical: `${SITE_URL}${PAGE_PATH}`,
  siteName: "Xoomplus",
  locale: "en_US",
  language: "en-US",
  modifiedTime: "2026-07-01T07:44:09+00:00",
  publishedTime: "2025-08-18T09:29:33+00:00",
  publisherFacebook: "https://www.facebook.com/xoomplus1/",
  readingTime: "8 minutes",
  productName: "Graphic Design Services",
  productDescription:
    "XoomPlus graphic design services include logo design, brand identity, social media post design, website UI/UX design, infographic design, and print design — delivering cohesive, market-ready visuals that build brand recognition and drive customer engagement.",
  productImage: HERO_SVG_URL,
  lowPrice: "300",
  highPrice: "1000",
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
    type: "article",
    locale: GRAPHIC_DESIGN_SEO.locale,
    url: GRAPHIC_DESIGN_SEO.canonical,
    siteName: GRAPHIC_DESIGN_SEO.siteName,
    title: GRAPHIC_DESIGN_SEO.title,
    description: GRAPHIC_DESIGN_SEO.description,
    modifiedTime: GRAPHIC_DESIGN_SEO.modifiedTime,
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
  other: {
    "article:publisher": GRAPHIC_DESIGN_SEO.publisherFacebook,
    "twitter:label1": "Est. reading time",
    "twitter:data1": GRAPHIC_DESIGN_SEO.readingTime,
  },
};

/** WebPage, BreadcrumbList, Organization, Product/AggregateOffer — from WP Yoast + on-page JSON-LD. */
export function getGraphicDesignJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": GRAPHIC_DESIGN_SEO.canonical,
        url: GRAPHIC_DESIGN_SEO.canonical,
        name: GRAPHIC_DESIGN_SEO.title,
        description: GRAPHIC_DESIGN_SEO.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${GRAPHIC_DESIGN_SEO.canonical}#product` },
        primaryImageOfPage: {
          "@id": `${GRAPHIC_DESIGN_SEO.canonical}#primaryimage`,
        },
        image: { "@id": `${GRAPHIC_DESIGN_SEO.canonical}#primaryimage` },
        thumbnailUrl: GRAPHIC_DESIGN_SEO.productImage,
        datePublished: GRAPHIC_DESIGN_SEO.publishedTime,
        dateModified: GRAPHIC_DESIGN_SEO.modifiedTime,
        inLanguage: GRAPHIC_DESIGN_SEO.language,
        breadcrumb: { "@id": `${GRAPHIC_DESIGN_SEO.canonical}#breadcrumb` },
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [GRAPHIC_DESIGN_SEO.canonical],
          },
        ],
      },
      {
        "@type": "ImageObject",
        inLanguage: GRAPHIC_DESIGN_SEO.language,
        "@id": `${GRAPHIC_DESIGN_SEO.canonical}#primaryimage`,
        url: GRAPHIC_DESIGN_SEO.productImage,
        contentUrl: GRAPHIC_DESIGN_SEO.productImage,
        width: 349,
        height: 275,
        caption: "Graphic Design Solutions",
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
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: GRAPHIC_DESIGN_SEO.siteName,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          inLanguage: GRAPHIC_DESIGN_SEO.language,
          "@id": `${SITE_URL}/#/schema/logo/image/`,
          url: LOGO_URL,
          contentUrl: LOGO_URL,
          width: GRAPHIC_DESIGN_SEO.ogImage.width,
          height: GRAPHIC_DESIGN_SEO.ogImage.height,
          caption: GRAPHIC_DESIGN_SEO.siteName,
        },
        image: {
          "@id": `${SITE_URL}/#/schema/logo/image/`,
        },
        sameAs: [...GRAPHIC_DESIGN_SEO.sameAs],
      },
      {
        "@type": "Product",
        "@id": `${GRAPHIC_DESIGN_SEO.canonical}#product`,
        name: GRAPHIC_DESIGN_SEO.productName,
        image: GRAPHIC_DESIGN_SEO.productImage,
        description: GRAPHIC_DESIGN_SEO.productDescription,
        brand: {
          "@type": "Brand",
          name: GRAPHIC_DESIGN_SEO.siteName,
        },
        offers: {
          "@type": "AggregateOffer",
          url: GRAPHIC_DESIGN_SEO.canonical,
          priceCurrency: GRAPHIC_DESIGN_SEO.priceCurrency,
          lowPrice: GRAPHIC_DESIGN_SEO.lowPrice,
          highPrice: GRAPHIC_DESIGN_SEO.highPrice,
          offerCount: GRAPHIC_DESIGN_SEO.offerCount,
        },
      },
    ],
  };
}
