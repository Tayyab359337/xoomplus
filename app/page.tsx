import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { BlogsSection } from "@/components/sections/blogs-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import { Hero } from "@/components/sections/hero";
import { LogoLoopSection } from "@/components/sections/logo-loop-section";
import { MetricsSection } from "@/components/sections/metrics-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ProfessionalCtaSection } from "@/components/sections/professional-cta-section";
import { ServicesSection } from "@/components/sections/services/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

/**
 * Homepage — Hero through Contact + Footer.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <LogoLoopSection />
        <AboutSection />
        <MetricsSection />
        <ServicesSection />
        <PortfolioSection />
        <FaqSection />
        <TestimonialsSection />
        <BlogsSection />
        <ProfessionalCtaSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
