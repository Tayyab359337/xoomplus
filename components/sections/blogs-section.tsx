"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { HoverLift } from "@/components/animations/HoverLift";
import {
  latestBlogPosts,
  blogsSectionCopy,
  type BlogPost,
} from "@/lib/data/blogs";
import type { HomepageBlogsCopy } from "@/lib/wordpress/types";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import mediaCard from "@/components/ui/media-card.module.css";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { cn } from "@/lib/utils";

import styles from "./blogs-section.module.css";

type BlogsSectionProps = {
  className?: string;
  posts?: BlogPost[];
  copy?: HomepageBlogsCopy;
};

/**
 * Blogs — latest 3 equal media cards (image + title + published date).
 */
export function BlogsSection({ className, posts, copy }: BlogsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const items = posts ?? latestBlogPosts;
  const sectionCopy = copy ?? blogsSectionCopy;

  return (
    <section
      ref={sectionRef}
      id="journal"
      aria-label="Studio journal"
      data-section-reveal
      className={cn(styles.section, className)}
    >
      <div className={styles.header}>
        <div data-reveal>
          <SectionEyebrow className={styles.eyebrow}>
            {sectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{sectionCopy.title}</h2>
          <p className={styles.body}>{sectionCopy.body}</p>
        </div>
        <div data-reveal className={styles.headerAside}>
          <HoverLift y={-2} scale={1.01} className="inline-flex">
            <Link href={sectionCopy.viewAll.href} className={styles.viewAll}>
              {sectionCopy.viewAll.label}
              <ArrowUpRight className={styles.viewAllIcon} aria-hidden />
            </Link>
          </HoverLift>
        </div>
      </div>

      <div data-reveal-stagger className={styles.grid}>
        {items.map((post) => (
          <div key={post.id} className={styles.gridItem}>
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Blog card — image + title + published date only.
 */
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <HoverLift y={-5} scale={1.01} className={styles.cardHover}>
      <article className={cn(mediaCard.card, styles.blogCard)}>
        <Link href={post.href} className={styles.cardLink}>
          <div className={cn(mediaCard.media, styles.blogMedia)}>
            {post.image ? (
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={mediaCard.image}
              />
            ) : null}
          </div>

          <div className={cn(mediaCard.content, styles.blogContent)}>
            <h3 className={cn(mediaCard.title, styles.blogTitle)}>
              {post.title}
            </h3>
            {post.publishedAt ? (
              <time className={styles.date} dateTime={post.publishedAt}>
                {post.publishedAt}
              </time>
            ) : null}
          </div>
        </Link>
      </article>
    </HoverLift>
  );
}
