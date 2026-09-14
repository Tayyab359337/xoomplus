import { cn } from "@/lib/utils";
import type { Location } from "@/lib/data/locations";

import styles from "./location-map.module.css";

type LocationMapProps = {
  location: Location;
  className?: string;
};

/**
 * Lightweight map preview — Google Maps embed, same pattern as the contact section.
 */
export function LocationMap({ location, className }: LocationMapProps) {
  return (
    <div className={cn(styles.frame, className)}>
      <iframe
        title={location.mapTitle}
        src={location.mapEmbedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className={styles.map}
      />
    </div>
  );
}
