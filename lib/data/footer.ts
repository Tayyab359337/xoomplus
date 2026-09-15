/**
 * Fallback footer when WordPress is unreachable.
 * Live pages use getSiteFooterContent() (homepage footer) via root layout.
 */
export const footerCopy = {
  tagline: "Digital marketing, web & design experts.",
  wordmark: "Xoomplus",
  navigation: [
    { label: "About Us", href: "/about/" },
    { label: "Our Services", href: "/services/" },
    { label: "Latest Blog", href: "/blogs/" },
    { label: "Contact Us", href: "/contact/" },
  ],
  services: [
    { label: "Digital Marketing", href: "/digital-marketing/" },
    { label: "Web Solutions", href: "/web-solutions/" },
    { label: "Graphic Design Solutions", href: "/graphic-design-solutions/" },
    { label: "Our Services", href: "/services/" },
  ],
  social: [
    { label: "Facebook", href: "https://www.facebook.com/xoomplus1/" },
    { label: "Instagram", href: "https://www.instagram.com/xoomplus1/" },
    { label: "LinkedIn", href: "https://pk.linkedin.com/company/xoomplus" },
  ],
  contact: {
    email: "info@xoomplus.co.uk",
    phone: "+44 330 010 4786",
    addressLines: [
      "Pakistan: +92 3280 397969",
      "Plot 207, Service Rd East I-10/3, Islamabad",
      "UK: +44 330 010 4786",
      "33 King St, Blackburn BB2 2DH, United Kingdom",
    ],
  },
  legal: [{ label: "Privacy Policy", href: "/privacy-policy/" }],
  copyrightName: "Xoomplus",
} as const;
