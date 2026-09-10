import { serviceCategories } from "@/lib/data/services";

/**
 * Editable agency footer — keep columns lean; wordmark lives in the component.
 */
export const footerCopy = {
  tagline: "Brand, product, and growth under one roof.",
  wordmark: "Xoomplus",
  navigation: [
    { label: "Work", href: "#work" },
    { label: "Approach", href: "#approach" },
    { label: "Studio", href: "#studio" },
    { label: "Journal", href: "#journal" },
    { label: "Contact", href: "#contact" },
  ],
  services: serviceCategories.map((category) => ({
    label: category.title,
    href: `#approach`,
  })),
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "X", href: "https://x.com/" },
    { label: "Behance", href: "https://www.behance.net/" },
  ],
  contact: {
    email: "hello@xoomplus.com",
    phone: "+971 4 000 0000",
    addressLines: ["Remote-first studio", "Dubai · Global"],
  },
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
  copyrightName: "Xoomplus",
} as const;
