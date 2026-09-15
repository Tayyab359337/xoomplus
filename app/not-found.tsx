import { SiteHeader } from "@/components/layout/site-header";
import { NotFoundExperience } from "@/components/sections/not-found-experience";

/**
 * Custom 404 — header + lightweight particle message.
 * Footer comes from the root layout (homepage footer).
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <NotFoundExperience />
    </>
  );
}
