import { LocationCard } from "@/components/locations/location-card";
import { locations } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

import styles from "./location-cards.module.css";

type LocationCardsProps = {
  className?: string;
};

/**
 * Location card grid — reads from the centralized locations array.
 */
export function LocationCards({ className }: LocationCardsProps) {
  return (
    <section
      aria-label="Our studios"
      className={cn(styles.section, className)}
    >
      <div className={styles.shell}>
        <ul className={styles.list}>
          {locations.map((location) => (
            <li key={location.slug}>
              <LocationCard location={location} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
