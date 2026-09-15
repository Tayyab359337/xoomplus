import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { LocationHashScroll } from "@/components/locations/location-hash-scroll";
import { LocationCard } from "@/components/locations/location-card";
import { LocationHero } from "@/components/locations/location-hero";
import { AppLink } from "@/components/ui/app-link";
import Magnet from "@/components/ui/magnet";
import { locationDetailCta, type Location } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

import styles from "./location-page.module.css";

type LocationPageProps = {
  location: Location;
  className?: string;
};

/**
 * Single-location page body. Add cities by extending location data — this
 * layout stays the same.
 */
export function LocationPage({ location, className }: LocationPageProps) {
  return (
    <div className={cn(styles.root, className)}>
      <LocationHashScroll />
      <LocationHero location={location} />

      <div className={styles.page}>
        <LocationCard location={location} showViewServices={false} />

        <section id="services" className={styles.services} aria-label="Services">
          <h2 className={styles.servicesTitle}>Services</h2>
          <ul className={styles.serviceList}>
            {location.services.map((service) => (
              <li key={service.href}>
                <AppLink href={service.href} className={styles.serviceLink}>
                  <span>{service.label}</span>
                  <ArrowUpRight aria-hidden className={styles.serviceIcon} />
                </AppLink>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.cta} aria-label="Get started">
          <h2 className={styles.ctaTitle}>{locationDetailCta.title}</h2>
          <p className={styles.ctaBody}>{locationDetailCta.body}</p>
          <Magnet padding={48} magnetStrength={3}>
            <Link href={locationDetailCta.href} className="btn-primary">
              {locationDetailCta.label}
              <span aria-hidden className="translate-y-px text-[0.95em]">
                →
              </span>
            </Link>
          </Magnet>
        </section>
      </div>
    </div>
  );
}
