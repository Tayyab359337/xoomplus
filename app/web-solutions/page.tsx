import { SiteHeader } from "@/components/layout/site-header";
import { WebSolutionsApproach } from "@/components/sections/web-solutions-approach";
import { WebSolutionsHero } from "@/components/sections/web-solutions-hero";
import { WebSolutionsSubServices } from "@/components/sections/web-solutions-sub-services";
import { WebSolutionsTechStack } from "@/components/sections/web-solutions-tech-stack";
import { WebSolutionsWhyUs } from "@/components/sections/web-solutions-why-us";
import { ProfessionalCtaSection } from "@/components/sections/professional-cta-section";
import { pageScaffoldContent as content } from "@/lib/data/page-scaffold";
import {
  getWebSolutionsJsonLd,
  webSolutionsMetadata,
} from "@/lib/seo/web-solutions";
import { getWebSolutionsPageContent } from "@/lib/wordpress";

export const metadata = webSolutionsMetadata;

export default async function WebSolutionsPage() {
  const wp = await getWebSolutionsPageContent();
  const jsonLd = getWebSolutionsJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <WebSolutionsHero copy={wp.hero} />
        <WebSolutionsSubServices copy={wp.servicesIntro} />
        <WebSolutionsTechStack />
        <WebSolutionsApproach />
        <WebSolutionsWhyUs />
        <ProfessionalCtaSection content={content.cta} />
      </main>
    </>
  );
}
