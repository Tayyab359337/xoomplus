import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FaqSection } from "@/components/sections/faq-section";
import { ProfessionalCtaSection } from "@/components/sections/professional-cta-section";
import { SeoExpertCta } from "@/components/sections/seo/seo-expert-cta";
import { SeoHero } from "@/components/sections/seo/seo-hero";
import { SeoProcess } from "@/components/sections/seo/seo-process";
import { SeoSubServices } from "@/components/sections/seo/seo-sub-services";
import { SeoWhyUs } from "@/components/sections/seo/seo-why-us";
import { PricingSection } from "@/components/ui/pricing-section";
import { seoCtaCopy } from "@/lib/data/seo-cta";
import { seoFaqCopy, seoFaqItems } from "@/lib/data/seo-faq";
import { seoPricingCopy, seoPricingPlans } from "@/lib/data/seo-pricing";
import { seoServicesHeroCopy } from "@/lib/data/seo-services-hero";
import {
  getSeoServicesJsonLd,
  searchEngineOptimizationMetadata,
} from "@/lib/seo/search-engine-optimization";

export const metadata = searchEngineOptimizationMetadata;

/**
 * SEO Services — hero, capabilities, process, pricing, expert CTA.
 */
export default function SearchEngineOptimizationPage() {
  const jsonLd = getSeoServicesJsonLd();

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
        <SeoHero copy={seoServicesHeroCopy} />
        <SeoSubServices />
        <SeoProcess />
        <SeoWhyUs />
        <SeoExpertCta />
        <PricingSection
          eyebrow={seoPricingCopy.eyebrow}
          title={seoPricingCopy.title}
          description={seoPricingCopy.description}
          monthlyLabel={seoPricingCopy.monthlyLabel}
          yearlyLabel={seoPricingCopy.yearlyLabel}
          plans={seoPricingPlans}
        />
        <ProfessionalCtaSection content={seoCtaCopy} />
        <FaqSection items={seoFaqItems} copy={seoFaqCopy} />
      </main>
      <SiteFooter />
    </>
  );
}
