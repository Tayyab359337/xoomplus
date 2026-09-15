import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { LocationPage } from "@/components/locations/location-page";
import { getLocationBySlug, locations } from "@/lib/data/locations";
import { getLocationMetadata } from "@/lib/seo/locations";

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};
  return getLocationMetadata(location);
}

/**
 * Single location page. Future cities are added via location data + generateStaticParams.
 */
export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <LocationPage location={location} />
      </main>
    </>
  );
}
