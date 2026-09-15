import { SiteHeader } from "@/components/layout/site-header";
import { ProfessionalCtaSection } from "@/components/sections/professional-cta-section";
import { pageScaffoldContent as content } from "@/lib/data/page-scaffold";

export default function BrandIdentityDesignPage() {
  return (
    <>
      <SiteHeader />
      <ProfessionalCtaSection content={content.cta} />
    </>
  );
}
