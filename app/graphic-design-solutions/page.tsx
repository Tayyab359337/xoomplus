import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FaqSection } from "@/components/sections/faq-section";
import { GraphicDesignApproach } from "@/components/sections/graphic-design/graphic-design-approach";
import { GraphicDesignHero } from "@/components/sections/graphic-design/graphic-design-hero";
import { GraphicDesignIndustries } from "@/components/sections/graphic-design/graphic-design-industries";
import { GraphicDesignShowcase } from "@/components/sections/graphic-design/graphic-design-showcase";
import { GraphicDesignSubServices } from "@/components/sections/graphic-design/graphic-design-sub-services";
import { GraphicDesignWhyUs } from "@/components/sections/graphic-design/graphic-design-why-us";
import { ProfessionalCtaSection } from "@/components/sections/professional-cta-section";
import { graphicDesignCtaCopy } from "@/lib/data/graphic-design-cta";
import {
  graphicDesignFaqCopy,
  graphicDesignFaqItems,
} from "@/lib/data/graphic-design-faq";
import {
  getGraphicDesignJsonLd,
  graphicDesignSolutionsMetadata,
} from "@/lib/seo/graphic-design-solutions";

export const metadata = graphicDesignSolutionsMetadata;

/**
 * Graphic Design Solutions — final page composition.
 * Reuses SiteHeader, SiteFooter, ProfessionalCtaSection, FaqSection.
 */
export default function GraphicDesignSolutionsPage() {
  const jsonLd = getGraphicDesignJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <main className="flex flex-1 flex-col overflow-x-clip">
        <GraphicDesignHero />
        <GraphicDesignSubServices />
        <GraphicDesignShowcase />
        <GraphicDesignApproach />
        <GraphicDesignWhyUs />
        <GraphicDesignIndustries />
        <ProfessionalCtaSection content={graphicDesignCtaCopy} />
        <FaqSection items={graphicDesignFaqItems} copy={graphicDesignFaqCopy} />
      </main>
      <SiteFooter />
    </>
  );
}
