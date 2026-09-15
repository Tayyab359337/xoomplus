import dynamic from "next/dynamic";

import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/sections/hero";
import { LogoLoopSection } from "@/components/sections/logo-loop-section";
import {
  getHomepageJsonLd,
  homepageMetadata,
} from "@/lib/seo/homepage";
import { getHomepageContent } from "@/lib/wordpress";

/** Near/above-fold copy — keep SSR, defer JS weight slightly after LCP. */
const AboutSection = dynamic(
  () =>
    import("@/components/sections/about-section").then((m) => ({
      default: m.AboutSection,
    })),
  { ssr: true },
);
const MetricsSection = dynamic(
  () =>
    import("@/components/sections/metrics-section").then((m) => ({
      default: m.MetricsSection,
    })),
  { ssr: true },
);

/** Heavy / below-fold client islands — defer CSS+JS until after first paint. */
const KineticTypeSection = dynamic(
  () =>
    import("@/components/sections/kinetic-type-section").then((m) => ({
      default: m.KineticTypeSection,
    })),
  { ssr: true },
);
const ServicesSection = dynamic(
  () =>
    import("@/components/sections/services/services-section").then((m) => ({
      default: m.ServicesSection,
    })),
  { ssr: true },
);
const PortfolioSection = dynamic(
  () =>
    import("@/components/sections/portfolio-section").then((m) => ({
      default: m.PortfolioSection,
    })),
  { ssr: true },
);
const FaqSection = dynamic(
  () =>
    import("@/components/sections/faq-section").then((m) => ({
      default: m.FaqSection,
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
 * Homepage — Hero is a Server Component for LCP; remaining sections map from WP page 215.
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
    </>
  );
}
