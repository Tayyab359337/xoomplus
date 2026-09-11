"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  latestBlogPosts,
  blogsSectionCopy,
  type BlogPost,
} from "@/lib/data/blogs";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { cn } from "@/lib/utils";

import styles from "./blogs-section.module.css";

type BlogsSectionProps = {
  className?: string;
};

/**
 * Blogs — latest 3 equal editorial cards (theme tokens, no featured hero).
 */
export function BlogsSection({ className }: BlogsSectionProps) {
  return (
    <section
      id="journal"
      aria-label="Studio journal"
      className={cn(styles.section, className)}
    >
      <div className={styles.header}>
        <div data-animate="fade-up">
          <SectionEyebrow className={styles.eyebrow}>
            {blogsSectionCopy.eyebrow}
          </SectionEyebrow>
          <h2 className={styles.title}>{blogsSectionCopy.title}</h2>
        </div>
        <div
          data-animate="fade-up"
          data-animate-delay="0.06"
          className={styles.headerAside}
        >
          <p className={styles.body}>{blogsSectionCopy.body}</p>
          <Link href={blogsSectionCopy.viewAll.href} className={styles.viewAll}>
            {blogsSectionCopy.viewAll.label}
            <ArrowUpRight className={styles.viewAllIcon} aria-hidden />
          </Link>
        </div>
      </div>

      <div data-animate="stagger" className={styles.grid}>
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
  );
}
