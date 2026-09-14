import type { Metadata } from "next";

import { formatLocationAddress, type Location } from "@/lib/data/locations";

export const locationsIndexMetadata: Metadata = {
  title: "Locations",
  description:
    "Visit Xoomplus in Jacksonville, Blackburn, and Islamabad — digital marketing, web, and design from our studios.",
  alternates: {
    canonical: "/locations/",
  },
};

export function getLocationMetadata(location: Location): Metadata {
  const { line1, line2 } = formatLocationAddress(location);

  return {
    title: location.name,
    description: `Xoomplus ${location.name} — ${line1}, ${line2}. ${location.phone}.`,
    alternates: {
      canonical: location.href,
    },
  };
}
