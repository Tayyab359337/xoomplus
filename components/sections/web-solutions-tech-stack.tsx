import {
  siCloudflare, siExpress, siFirebase, siLaravel, siMongodb,
  siNextdotjs, siNodedotjs, siPostgresql, siPrisma, siShopify,
  siSupabase, siWordpress, type SimpleIcon,
} from "simple-icons";

import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { SolarSystem, type OrbitConfig, type SolarSystemItem } from "@/components/ui/solar-system";
import { webSolutionsTechnologies } from "@/lib/data/web-solutions";

import styles from "./web-solutions-tech-stack.module.css";

const icons: Record<string, SimpleIcon> = { next: siNextdotjs, node: siNodedotjs, wordpress: siWordpress, laravel: siLaravel, express: siExpress, postgresql: siPostgresql, prisma: siPrisma, shopify: siShopify, firebase: siFirebase, mongodb: siMongodb, supabase: siSupabase, cloudflare: siCloudflare };

const orbitItems = (orbit: number): SolarSystemItem[] => webSolutionsTechnologies.filter((technology) => technology.orbit === orbit).map((technology) => {
  const icon = icons[technology.icon];
  return { id: technology.icon, label: technology.name, color: `#${icon.hex}`, svg: <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d={icon.path} /></svg> };
});

const orbits: OrbitConfig[] = [
  { id: "inner", name: "Core platforms", radiusClass: "var(--radius-inner)", radiusPx: 175, speed: 24, items: orbitItems(1) },
  { id: "mid", name: "Application tools", radiusClass: "var(--radius-mid)", radiusPx: 285, speed: 34, items: orbitItems(2) },
  { id: "outer", name: "Cloud services", radiusClass: "var(--radius-outer)", radiusPx: 395, speed: 46, items: orbitItems(3) },
];

export function WebSolutionsTechStack() {
  return <section id="tech-stack" aria-labelledby="tech-stack-title" className={styles.section}><div className={styles.shell}><header className={styles.intro}><SectionEyebrow number="01">Our Tech Stack</SectionEyebrow><h2 id="tech-stack-title" className={styles.title}>A considered ecosystem for every web build.</h2><p className={styles.body}>We choose proven platforms and tools around the needs of the project, from flexible content management to custom applications and cloud-ready data.</p></header><div className={styles.system}><SolarSystem aria-label="Web Solutions technology ecosystem" orbits={orbits} centerLogo={<span className={styles.logo} aria-label="Xoomplus">XP</span>} /></div></div></section>;
}