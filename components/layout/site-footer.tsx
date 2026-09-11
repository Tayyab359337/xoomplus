"use client";

import Link from "next/link";
import type { ReactNode, SVGProps } from "react";

import { BrandMark } from "@/components/layout/brand-mark";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { footerCopy } from "@/lib/data/footer";
import type { HomepageFooter } from "@/lib/wordpress/types";
import { isInternalHref } from "@/lib/wordpress/urls";
import { cn } from "@/lib/utils";

import styles from "./site-footer.module.css";

type SiteFooterProps = {
  className?: string;
  content?: HomepageFooter;
};

type IconProps = SVGProps<SVGSVGElement>;

function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.174 2.097 15.943 2 14.643 2 11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
    </svg>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M6.94 8.5H3.56V21h3.38V8.5zM5.25 3A1.97 1.97 0 1 0 5.26 6.94 1.97 1.97 0 0 0 5.25 3zM21 21h-3.37v-6.59c0-1.84-.66-2.86-2.1-2.86-1.55 0-2.2 1.05-2.2 2.86V21H9.95V8.5h3.24v1.48c.66-.97 1.84-1.78 3.8-1.78 2.72 0 4.01 1.66 4.01 5.09V21z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<
  string,
  (props: IconProps) => React.JSX.Element
> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
};

function FooterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}

/**
 * Compact multi-column agency footer + oversized Xoomplus Text Hover wordmark.
 */
export function SiteFooter({ className, content }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const copy = content ?? footerCopy;
  const social = copy.social.length > 0 ? copy.social : footerCopy.social;

  return (
    <footer data-animate="fade-up" className={cn(styles.footer, className)}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <BrandMark height={34} className={styles.logo} />
          <p className={styles.tagline}>{copy.tagline}</p>
          <ul className={styles.socialList}>
            {social.map((item) => {
              const Icon = SOCIAL_ICONS[item.label];
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {Icon ? <Icon className={styles.socialIcon} /> : null}
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <nav className={styles.col} aria-label="Footer navigation">
          <p className={styles.colTitle}>Navigate</p>
          <ul className={styles.linkList}>
            {copy.navigation.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href} className={styles.link}>
                  {item.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Services">
          <p className={styles.colTitle}>Services</p>
          <ul className={styles.linkList}>
            {copy.services.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href} className={styles.link}>
                  {item.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <p className={styles.colTitle}>Contact</p>
          <ul className={styles.contactList}>
            <li>
              <a href={`mailto:${copy.contact.email}`} className={styles.link}>
                {copy.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${copy.contact.phone.replace(/\s/g, "")}`}
                className={styles.link}
              >
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
              <FooterLink href={item.href} className={styles.legalLink}>
                {item.label}
              </FooterLink>
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
