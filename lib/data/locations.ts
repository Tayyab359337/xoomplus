export type LocationService = {
  label: string;
  href: string;
};

export type Location = {
  slug: string;
  name: string;
  descriptor: string;
  street: string;
  suite?: string;
  city: string;
  state?: string;
  zip?: string;
  localityLine?: string;
  phone: string;
  phoneHref: string;
  lat: number;
  lng: number;
  mapEmbedSrc: string;
  mapTitle: string;
  directionsUrl: string;
  href: string;
  servicesHref: string;
  services: LocationService[];
};

const LOCATION_SERVICES: LocationService[] = [
  { label: "Digital Marketing", href: "/digital-marketing/" },
  { label: "Web Solutions", href: "/web-solutions/" },
  { label: "Graphic Design", href: "/graphic-design-solutions/" },
  {
    label: "SEO",
    href: "/digital-marketing/search-engine-optimization/",
  },
];

function mapsFor(address: string) {
  return {
    mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
  };
}

function locationEntry({
  fullAddress,
  ...location
}: Omit<
  Location,
  "mapEmbedSrc" | "directionsUrl" | "href" | "servicesHref" | "services"
> & { fullAddress: string }): Location {
  const maps = mapsFor(fullAddress);
  return {
    ...location,
    ...maps,
    href: `/locations/${location.slug}/`,
    servicesHref: `/locations/${location.slug}/#services`,
    services: LOCATION_SERVICES,
  };
}

/**
 * Central location catalog — offices from Xoomplus contact details,
 * plus Jacksonville. Cards, mega menu, maps, and detail pages all read this array.
 */
export const locations: Location[] = [
  locationEntry({
    slug: "jacksonville-fl",
    name: "Jacksonville, FL",
    descriptor: "Florida studio",
    street: "9424 Baymeadows Road",
    suite: "Suite 250",
    city: "Jacksonville",
    state: "FL",
    zip: "32256",
    phone: "(904) 865-5030",
    phoneHref: "tel:+19048655030",
    lat: 30.2194,
    lng: -81.548,
    mapTitle: "Xoomplus Jacksonville studio map",
    fullAddress: "9424 Baymeadows Road, Suite 250, Jacksonville, FL 32256",
  }),
  locationEntry({
    slug: "blackburn-uk",
    name: "Blackburn, UK",
    descriptor: "United Kingdom studio",
    street: "33 King Street",
    city: "Blackburn",
    zip: "BB2 2DH",
    localityLine: "Blackburn BB2 2DH, United Kingdom",
    phone: "+44 330 010 4786",
    phoneHref: "tel:+443300104786",
    lat: 53.7465,
    lng: -2.4848,
    mapTitle: "Xoomplus Blackburn studio map",
    fullAddress: "33 King St, Blackburn BB2 2DH, United Kingdom",
  }),
  locationEntry({
    slug: "islamabad-pakistan",
    name: "Islamabad, Pakistan",
    descriptor: "Pakistan studio",
    street: "Plot 207, Service Road East I-10/3",
    city: "Islamabad",
    localityLine: "Islamabad, Pakistan",
    phone: "+92 3280 397969",
    phoneHref: "tel:+923280397969",
    lat: 33.6559732,
    lng: 73.042949,
    mapTitle: "Xoomplus Islamabad studio map",
    fullAddress: "Plot 207, Service Road East I-10/3, Islamabad, Pakistan",
  }),
];

export const locationsBySlug: Record<string, Location> = Object.fromEntries(
  locations.map((location) => [location.slug, location]),
);

export function getLocationBySlug(slug: string): Location | undefined {
  return locationsBySlug[slug];
}

export function formatLocationAddress(location: Location) {
  const line1 = [location.street, location.suite].filter(Boolean).join(", ");
  if (location.localityLine) {
    return { line1, line2: location.localityLine };
  }
  const regionZip = [location.state, location.zip].filter(Boolean).join(" ");
  const line2 = [location.city, regionZip].filter(Boolean).join(", ");
  return { line1, line2 };
}

export const locationsPageCopy = {
  hero: {
    eyebrow: "Presence",
    title: "Locations",
    body: "Studios in Jacksonville, Blackburn, and Islamabad — a local partner wherever the work lives.",
  },
  cta: {
    title: "Ready to grow your business?",
    body: "Tell us what you want to ship. The nearest studio will take it from there.",
    label: "Get Started",
    href: "/appointment-booking/",
  },
} as const;

export const locationDetailCta = {
  title: "Let’s talk about the work.",
  body: "Share the brief — we’ll tell you how we’d start.",
  label: "Get Started",
  href: "/appointment-booking/",
} as const;
