"use client";

import Link from "next/link";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { footerCopy } from "@/lib/data/footer";
import { cn } from "@/lib/utils";

import styles from "./site-footer.module.css";

type SiteFooterProps = {
  className?: string;
};

/**
 * Compact multi-column agency footer + oversized Xoomplus Text Hover wordmark.
 */
export function SiteFooter({ className }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const copy = footerCopy;

  return (
    <footer className={cn(styles.footer, className)}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo}>
            Xoom<span className={styles.logoAccent}>plus</span>
          </Link>
          <p className={styles.tagline}>{copy.tagline}</p>
          <ul className={styles.socialList}>
            {copy.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className={styles.col} aria-label="Footer navigation">
          <p className={styles.colTitle}>Navigate</p>
          <ul className={styles.linkList}>
            {copy.navigation.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Services">
          <p className={styles.colTitle}>Services</p>
          <ul className={styles.linkList}>
            {copy.services.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <p className={styles.colTitle}>Contact</p>
          <ul className={styles.contactList}>
            <li>
              <a
                href={`mailto:${copy.contact.email}`}
                className={styles.link}
              >
                {copy.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${copy.contact.phone.replace(/\s/g, "")}`} className={styles.link}>
                {copy.contact.phone}
              </a>
            </li>
            {copy.contact.addressLines.map((line) => (
              <li key={line} className={styles.addressLine}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.legalBar}>
        <p className={styles.copyright}>
          © {year} {copy.copyrightName}
        </p>
        <ul className={styles.legalList}>
          {copy.legal.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className={styles.legalLink}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.wordmark} aria-label={copy.wordmark}>
        <TextHoverEffect text={copy.wordmark} duration={0.2} />
      </div>
    </footer>
  );
}
