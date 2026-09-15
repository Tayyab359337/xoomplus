import dynamic from "next/dynamic";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { LogoLoopSection } from "@/components/sections/logo-loop-section";
import { MetricsSection } from "@/components/sections/metrics-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ServicesSection } from "@/components/sections/services/services-section";
import {
  getHomepageJsonLd,
  homepageMetadata,
} from "@/lib/seo/homepage";
import { getHomepageContent } from "@/lib/wordpress";

/** Heavy / below-fold client islands — defer JS until after first paint. */
const KineticTypeSection = dynamic(
  () =>
    import("@/components/sections/kinetic-type-section").then((m) => ({
      default: m.KineticTypeSection,
    })),
  { ssr: true },
);
const ProfessionalCtaSection = dynamic(
  () =>
    import("@/components/sections/professional-cta-section").then((m) => ({
      default: m.ProfessionalCtaSection,
    })),
  { ssr: true },
);
const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/testimonials-section").then((m) => ({
      default: m.TestimonialsSection,
    })),
  { ssr: true },
);
const BlogsSection = dynamic(
  () =>
    import("@/components/sections/blogs-section").then((m) => ({
      default: m.BlogsSection,
    })),
  { ssr: true },
);
const ContactSection = dynamic(
  () =>
    import("@/components/sections/contact-section").then((m) => ({
      default: m.ContactSection,
    })),
  { ssr: true },
);

export const metadata = homepageMetadata;

/** Refresh WordPress-driven homepage content (logos, copy, etc.). */
export const revalidate = 300;

/**
 * Homepage — Hero unchanged; remaining sections mapped from WordPress page 215.
 */
export default async function Home() {
  const content = await getHomepageContent();
  const jsonLd = getHomepageJsonLd();

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
        <Hero />
        <LogoLoopSection logos={content.logos} copy={content.logosCopy} />
        <AboutSection content={content.about} />
        <MetricsSection metrics={content.metrics} copy={content.metricsCopy} />
        <KineticTypeSection />
        <ServicesSection
          services={content.services}
          copy={content.servicesCopy}
        />
        <PortfolioSection
          projects={content.portfolio}
          copy={content.portfolioCopy}
        />
        <FaqSection items={content.faqs} copy={content.faqsCopy} />
        <ProfessionalCtaSection content={content.cta} />
        <TestimonialsSection
          items={content.testimonials}
          copy={content.testimonialsCopy}
        />
        <BlogsSection posts={content.blogs} copy={content.blogsCopy} />
        <ContactSection headings={content.contactCopy} />
      </main>
      <SiteFooter content={content.footer} />
    </>
  );
}
