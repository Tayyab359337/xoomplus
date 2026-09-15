import dynamic from "next/dynamic";

import { SiteHeader } from "@/components/layout/site-header";
import { AboutHero } from "@/components/sections/about/about-hero";
import { ProfessionalCtaSection } from "@/components/sections/professional-cta-section";
import { SeoWhyUs } from "@/components/sections/seo/seo-why-us";
import {
  aboutWhyUsAvatars,
  aboutWhyUsCopy,
  aboutWhyUsItems,
  aboutWorkCopy,
} from "@/lib/data/about";
import { pageScaffoldContent as scaffold } from "@/lib/data/page-scaffold";
import { aboutMetadata, getAboutJsonLd } from "@/lib/seo/about";
import { getHomepageContent } from "@/lib/wordpress";

const AboutExpertise = dynamic(
  () =>
    import("@/components/sections/about/about-expertise").then((m) => ({
      default: m.AboutExpertise,
    })),
  { ssr: true },
);
const AboutWorkShowcase = dynamic(
  () =>
    import("@/components/sections/about/about-work-showcase").then((m) => ({
      default: m.AboutWorkShowcase,
    })),
  { ssr: true },
);
const AboutSuccess = dynamic(
  () =>
    import("@/components/sections/about/about-success").then((m) => ({
      default: m.AboutSuccess,
    })),
  { ssr: true },
);

export const metadata = aboutMetadata;

/** Portfolio/case-study media is shared with the homepage WordPress source. */
export const revalidate = 300;

/**
 * About — hero, expertise, case studies, why us, success stories, CTA.
 */
export default async function AboutPage() {
  const content = await getHomepageContent();
  const jsonLd = getAboutJsonLd();
  const workCopy = {
    ...content.portfolioCopy,
    eyebrow: aboutWorkCopy.eyebrow,
    title: aboutWorkCopy.title,
    body: aboutWorkCopy.body,
  };

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
        <AboutHero />
        <AboutExpertise />
        <AboutWorkShowcase projects={content.portfolio} copy={workCopy} />
        <SeoWhyUs
          copy={aboutWhyUsCopy}
          items={aboutWhyUsItems}
          teamAvatars={aboutWhyUsAvatars}
          ariaLabel="Why choose Xoomplus"
        />
        <AboutSuccess />
        <ProfessionalCtaSection content={scaffold.cta} />
      </main>
    </>
  );
}
