"use client";

import { useRef } from "react";

import Carousel, { type SlideData } from "@/components/ui/carousel";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { webSolutionsSubServices, webSolutionsSubServicesCopy, type WebSolutionsServicesIntro, type WebSolutionsSubService } from "@/lib/data/web-solutions";
import { cn } from "@/lib/utils";

import styles from "./web-solutions-sub-services.module.css";

export function WebSolutionsSubServices({ className, services, copy }: { className?: string; services?: WebSolutionsSubService[]; copy?: WebSolutionsServicesIntro }) {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);
  const items = services ?? webSolutionsSubServices;
  const sectionCopy = copy ?? webSolutionsSubServicesCopy;
  const slides: SlideData[] = items.map((service) => ({ title: service.title, description: service.description, category: service.category, src: service.image, button: "Explore Service", href: service.href }));

  return (
    <section ref={ref} id="sub-services" aria-labelledby="web-services-title" data-section-reveal className={cn(styles.section, className)}>
      <div className={styles.shell}>
        <header data-reveal className={styles.intro}><SectionEyebrow>{sectionCopy.eyebrow}</SectionEyebrow><h2 id="web-services-title" className={styles.title}>{sectionCopy.title}</h2><p className={styles.body}>{sectionCopy.body}</p></header>
        <div data-reveal><Carousel slides={slides} ariaLabel="Web Solutions sub-services" /></div>
      </div>
    </section>
  );
}
