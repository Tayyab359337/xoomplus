import { ArrowUpRight, MapPin } from "lucide-react";

import { AppLink } from "@/components/ui/app-link";
import {
  formatLocationAddress,
  locations,
} from "@/lib/data/locations";
import { cn } from "@/lib/utils";

const LOCATIONS_INDEX_HREF = "/locations/";

/**
 * Locations mega panel — driven by the locations data array.
 */
export function LocationMegaMenu({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={cn("flex w-full flex-col gap-4 p-5 sm:p-6", className)}
      role="region"
      aria-label="Locations"
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {locations.map((location) => {
          const address = formatLocationAddress(location);
          return (
            <li key={location.slug}>
              <AppLink
                href={location.href}
                onClick={onNavigate}
                className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-card px-4 py-3.5 text-card-foreground transition-colors hover:border-accent/35 hover:bg-hover/80"
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-accent"
                >
                  <MapPin className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.08rem] font-semibold leading-snug tracking-[-0.02em] text-foreground">
                    {location.name}
                  </span>
                  <span className="mt-0.5 block text-[0.92rem] leading-snug text-muted-foreground">
                    {location.descriptor}
                  </span>
                  <span className="mt-1.5 block text-[0.85rem] leading-snug text-muted-foreground">
                    {address.line1}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-accent/50 group-hover:text-accent"
                >
                  <ArrowUpRight className="size-3.5" />
                </span>
              </AppLink>
            </li>
          );
        })}
      </ul>

      <AppLink
        href={LOCATIONS_INDEX_HREF}
        onClick={onNavigate}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center text-[0.95rem] font-medium text-foreground/80 transition-colors hover:bg-muted/40 hover:text-foreground"
      >
        View all locations
        <ArrowUpRight className="size-3.5" />
      </AppLink>
    </div>
  );
}
