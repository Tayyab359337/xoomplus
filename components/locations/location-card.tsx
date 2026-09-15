import { MapPin, Phone } from "lucide-react";

import { LocationMap } from "@/components/locations/location-map";
import { AppLink } from "@/components/ui/app-link";
import {
  formatLocationAddress,
  type Location,
} from "@/lib/data/locations";
import { cn } from "@/lib/utils";

import styles from "./location-card.module.css";

type LocationCardProps = {
  location: Location;
  className?: string;
  showViewServices?: boolean;
};

/**
 * Location card — info + map preview. Layout follows the supplied reference:
 * desktop side-by-side, mobile stacked (info, map, actions).
 */
export function LocationCard({
  location,
  className,
  showViewServices = true,
}: LocationCardProps) {
  const address = formatLocationAddress(location);

  return (
    <article className={cn(styles.card, className)}>
      <div className={styles.info}>
        <h3 className={styles.title}>{location.name}</h3>

        <p className={styles.row}>
          <MapPin aria-hidden className={styles.icon} />
          <span>
            <span className={styles.line}>{address.line1}</span>
            <span className={styles.line}>{address.line2}</span>
          </span>
        </p>

        <a href={location.phoneHref} className={styles.phone}>
          <Phone aria-hidden className={styles.icon} />
          <span>{location.phone}</span>
        </a>
      </div>

      <div className={styles.map}>
        <LocationMap location={location} />
      </div>

      <div className={styles.actions}>
        {showViewServices ? (
          <AppLink href={location.servicesHref} className="btn-primary">
            View Services
          </AppLink>
        ) : null}
        <a
          href={location.directionsUrl}
          className="btn-ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>
    </article>
  );
}
