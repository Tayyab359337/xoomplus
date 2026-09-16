"use client";

import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { webSolutionsApproachStages } from "@/lib/data/web-solutions";

import styles from "./web-solutions-approach.module.css";

const handleStackComplete = () => undefined;

function StageCard({ stage }: { stage: (typeof webSolutionsApproachStages)[number] }) {
  return <article className={styles.card}><span className={styles.number}>{stage.number}</span><div><h3>{stage.title}</h3><p>{stage.description}</p></div><span className={styles.mark} aria-hidden>X+</span></article>;
}

export function WebSolutionsApproach() {
  const reduceMotion = usePrefersReducedMotion();
  return <section id="approach" aria-labelledby="approach-title" className={styles.section}><div className={styles.header}><SectionEyebrow number="02">Our Approach</SectionEyebrow><h2 id="approach-title">A clear route from first brief to live product.</h2><p>Good web work is a sequence of useful decisions. Our process keeps the strategy, experience, and build moving in the same direction.</p></div>{reduceMotion ? <div className={styles.staticStack}>{webSolutionsApproachStages.map((stage) => <StageCard key={stage.number} stage={stage} />)}</div> : <ScrollStack className={styles.stack} useWindowScroll itemDistance={70} itemStackDistance={24} stackPosition="18%" scaleEndPosition="8%" baseScale={0.92} onStackComplete={handleStackComplete}>{webSolutionsApproachStages.map((stage) => <ScrollStackItem key={stage.number} itemClassName={styles.stackItem}><StageCard stage={stage} /></ScrollStackItem>)}</ScrollStack>}</section>;
}
