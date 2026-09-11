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
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { cn } from "@/lib/utils";

import styles from "./blogs-section.module.css";

type BlogsSectionProps = {
  className?: string;
};

/**
 * Blogs — latest 3 equal editorial cards (theme tokens, no featured hero).
 */
export function BlogsSection({ className }: BlogsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

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
            {blogsSectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{blogsSectionCopy.title}</h2>
        </div>
        <div data-reveal className={styles.headerAside}>
          <p className={styles.body}>{blogsSectionCopy.body}</p>
          <HoverLift y={-2} scale={1.01} className="inline-flex">
            <Link href={blogsSectionCopy.viewAll.href} className={styles.viewAll}>
              {blogsSectionCopy.viewAll.label}
              <ArrowUpRight className={styles.viewAllIcon} aria-hidden />
            </Link>
          </HoverLift>
        </div>
      </div>

      <div data-reveal-stagger className={styles.grid}>
        {latestBlogPosts.map((post) => (
          <div key={post.id} className={styles.gridItem}>
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <HoverLift y={-5} scale={1.01} className={styles.cardHover}>
      <article className={styles.card}>
        <Link href={post.href} className={styles.cardLink}>
          <div className={styles.media}>
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={styles.image}
            />
          </div>

          <div className={styles.content}>
            <div className={styles.metaRow}>
              <span className={styles.category}>{post.category}</span>
              {post.publishedAt || post.readTime ? (
                <span className={styles.meta}>
                  {post.publishedAt}
                  {post.publishedAt && post.readTime ? " · " : null}
                  {post.readTime}
                </span>
              ) : null}
            </div>

            <h3 className={styles.cardTitle}>{post.title}</h3>
            <p className={styles.excerpt}>{post.excerpt}</p>

            <span className={styles.readMore}>
              Read more
              <ArrowUpRight className={styles.readMoreIcon} aria-hidden />
            </span>
          </div>
        </Link>
      </article>
    </HoverLift>
  );
}
