import { BarChart3, Compass, Wrench } from "lucide-react";

import { BorderBeam } from "@/components/ui/border-beam";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { aboutWhyUsCopy, aboutWhyUsItems } from "@/lib/data/about";

import styles from "./web-solutions-why-us.module.css";

const icons = [Compass, Wrench, BarChart3];

export function WebSolutionsWhyUs() {
  return <section id="why-us" aria-labelledby="why-us-title" className={styles.section}><div className={styles.shell}><header className={styles.intro}><SectionEyebrow number="03">{aboutWhyUsCopy.eyebrow}</SectionEyebrow><h2 id="why-us-title">{aboutWhyUsCopy.title}</h2><p>{aboutWhyUsCopy.body}</p></header><div className={styles.field}><svg className={styles.path} viewBox="0 0 1200 320" aria-hidden><path d="M25 235 C190 35 330 35 420 174 S670 315 780 145 S1040 35 1175 210" /></svg><div className={styles.cards}>{aboutWhyUsItems.slice(0, 3).map((item, index) => { const Icon = icons[index]; return <article key={item.id} className={`${styles.card} ${index === 1 ? styles.featured : ""}`}>{index === 1 ? <BorderBeam size={90} duration={7} colorFrom="var(--primary)" colorTo="var(--chart-3)" borderWidth={1.5} /> : null}<div className={styles.icon}><Icon aria-hidden strokeWidth={1.6} /></div><span className={styles.number}>{item.id}</span><h3>{item.title}</h3><p>{item.description}</p></article>; })}</div></div></div></section>;
}
