import { SiteHeader } from "@/components/layout/site-header";
import { LocationCards } from "@/components/locations/location-cards";
import { LocationsCta } from "@/components/locations/locations-cta";
import { LocationsHero } from "@/components/locations/locations-hero";
import { locationsIndexMetadata } from "@/lib/seo/locations";

export const metadata = locationsIndexMetadata;

/**
 * Locations index — hero map, studio cards, dotted-map CTA.
 */
export default function LocationsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <LocationsHero />
        <LocationCards />
        <LocationsCta />
      </main>
    </>
  );
}
