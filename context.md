# Xoomplus Website — AI Development Context

## 1. Project Overview

| Item | Value |
| ---- | ----- |
| Project name | `xoomplus-site` |
| Brand / site | Xoomplus (xoomplus.co.uk) |
| Purpose | Marketing site for a digital marketing, web development, and graphic design agency |
| Framework | Next.js **16.3.4** (App Router) |
| React | **19.2.8** |
| Styling | Tailwind CSS **v4** + CSS Modules + design tokens in `app/globals.css` |
| Animation | GSAP 3 + `@gsap/react`, Motion (`motion`), CSS transitions |
| WebGL / canvas | Three.js (`liquid-ether`), OGL (`soft-aurora`, `web-threads`, etc.) |
| CMS source | WordPress at `https://xoomplus.co.uk` via WP REST API + HTML parsing |
| Email | Resend (preferred) or SMTP via `/api/contact` |
| Path style | `trailingSlash: true` (WordPress-compatible URLs) |

This is a Next.js App Router site that rebuilds the Xoomplus marketing experience. Server Components fetch and transform WordPress content where integrated; client islands handle navigation, forms, GSAP reveals, and decorative WebGL. Most global chrome (theme, animation root, page fade, footer) lives in the root layout. Per-page headers and section compositions live in route files.

**Rendering model:** Server Components by default; `"use client"` only where interactivity or browser APIs are required. Homepage uses `revalidate = 300`. WordPress fetches use `next: { revalidate: 300 }`.

**Do not invent architecture.** Prefer existing `lib/wordpress`, `lib/data`, `components/sections`, and tokens in `globals.css`.

---

## 2. Core Architecture

Only directories that exist in this repo:

```
app/                 # Routes, root layout, globals.css, API routes
components/          # UI, layout, sections, effects, animations, locations
hooks/               # Client hooks (media query, reduced motion, section reveal, …)
lib/                 # WordPress, data, SEO, animations, email, utilities
public/              # Static assets (brand SVGs, default Next SVGs)
types/               # Ambient TS (CSS modules)
reference/           # Reference HTML/assets (not runtime)
scripts/             # Ad-hoc scripts
.cursor/rules/       # Agent rules (e.g. section-intro-design)
```

There is **no** top-level `utils/` folder. Shared helpers live in `lib/utils.ts` (`cn`).

### Important files

| Path | Role | Modify carefully? |
| ---- | ---- | ----------------- |
| `app/layout.tsx` | Root layout: fonts, metadata base, footer fetch, `AppProviders` | Yes — global |
| `app/globals.css` | Design tokens, typography, buttons, container, a11y, cursor CSS | Yes — design system |
| `app/page.tsx` | Homepage composition + WP content | Yes — LCP / WP mapping |
| `next.config.ts` | Trailing slash + remote image hosts | Yes |
| `lib/wordpress/*` | WP fetch, parse, URL mapping | Yes — data architecture |
| `components/providers/app-providers.tsx` | Theme + animation root + page transition | Yes |
| `components/effects/liquid-ether.jsx` | Homepage WebGL field | **Protected** |
| `components/sections/hero.tsx` | Homepage hero (Liquid Ether + LCP H1) | Yes |

### `app/`

- Route segments mirror WordPress paths (`/graphic-design-solutions/`, `/digital-marketing/.../`).
- Only `app/layout.tsx` exists as a layout (no nested layouts).
- `app/api/contact/route.ts` — contact form POST handler.
- `app/not-found.tsx` — custom 404.

### `components/`

| Folder | Purpose |
| ------ | ------- |
| `layout/` | Header, footer, brand, desktop/mobile nav, theme toggle |
| `sections/` | Page sections (home, SEO, graphic design, CTA, contact, …) |
| `locations/` | Locations index/detail UI |
| `effects/` | WebGL/backgrounds (Liquid Ether, SoftAurora, WebThreads, …) |
| `animations/` | PageTransition, AnimationProvider, HeroEntrance, Magnetic, … |
| `motion/` | Reveal / parallax / stagger helpers |
| `ui/` | Shared primitives (navbar, pricing, eyebrows, magnets, maps, …) |
| `providers/` | Theme + app providers |
| `scroll-expand/` | Scroll-expand experiment/component |

### `lib/`

| Folder | Purpose |
| ------ | ------- |
| `wordpress/` | Config, fetchers, HTML parsers, types, URL helpers |
| `data/` | Static/typed content (services, SEO copy, locations, fallbacks, scaffolds) |
| `seo/` | Metadata + JSON-LD builders |
| `animations/` | GSAP registration, ScrollTrigger, motion config, page fade helpers |
| `email/` | Contact email send (Resend / SMTP) |
| `motion/` | Motion variants/transitions |
| `cursor/` | Custom cursor engine (**not mounted** in current `AppProviders`) |
| `lazy/` | Client lazy helpers |
| `navigation/` | Hash scroll helpers |

---

## 3. WordPress → Next.js Data Architecture

### Source

| Constant | Value |
| -------- | ----- |
| Origin | `https://xoomplus.co.uk` (`WP_ORIGIN`) |
| REST base | `https://xoomplus.co.uk/wp-json/wp/v2` (`WP_REST`) |
| Homepage page ID | `215` (`WP_HOME_PAGE_ID`), slug `home` |
| Graphic Design page ID | `2417` (`WP_GRAPHIC_DESIGN_PAGE_ID`) |
| Contact page (footer phones/email scrape) | REST page `1079` |

**Auth:** none in code — public REST + public HTML.

**Secrets:** WordPress calls do not use tokens. Contact email uses env vars (names only): `RESEND_API_KEY`, `SMTP_*`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. Never commit values.

### Endpoints actually used

| Call | Where | Purpose |
| ---- | ----- | ------- |
| `GET ${WP_REST}/pages/215` | `get-homepage-content.ts` | Homepage `content.rendered` fallback |
| `GET ${WP_ORIGIN}/` | same | Live HTML preferred when length > 10k |
| `GET ${WP_REST}/posts?per_page=3&_embed=1&orderby=date&order=desc` | same | Blog cards (+ featured media) |
| `GET ${WP_REST}/pages/1079?_fields=content` | same | Contact details for footer |
| `GET ${WP_REST}/media?search=…&per_page=…&_fields=id,source_url,alt_text,title,slug` | same | Portfolio image resolution |
| `GET ${WP_REST}/pages/2417?_fields=id,title,content` | `get-graphic-design-content.ts` | Graphic Design hero + services intro |

Representative examples:

```
https://xoomplus.co.uk/wp-json/wp/v2/pages/215
https://xoomplus.co.uk/wp-json/wp/v2/posts?per_page=3&_embed=1&orderby=date&order=desc
https://xoomplus.co.uk/wp-json/wp/v2/pages/2417?_fields=id,title,content
https://xoomplus.co.uk/wp-json/wp/v2/media?search=portfolio&per_page=40&_fields=id,source_url,alt_text,title,slug
```

No custom WP plugin endpoints are used. Categories/taxonomies are not fetched as first-class resources.

### Fetching & caching

- **Server-side only** (async server functions / RSC).
- `fetch(..., { next: { revalidate: 300 } })`.
- Homepage also exports `export const revalidate = 300`.
- `getHomepageContent` is wrapped in React `cache()` so layout footer + homepage share one request tree.
- `getSiteFooterContent()` calls `getHomepageContent()` and falls back to `lib/data/footer.ts` on error.

### Transformation pipeline

```
WordPress (Elementor HTML / REST JSON)
  → fetch (pages / posts / media / live HTML)
  → parseHomepageHtml / parseGraphicDesignHtml
  → map to frontend types (HomepageContent, GraphicDesignPageContent)
  → mapWpHref() for internal links
  → page.tsx / layout → section components
```

**Homepage notes:**

- Hero is **not** from WordPress — hardcoded in `components/sections/hero.tsx`.
- Live HTML preferred over REST when sufficiently long; REST used to fill logos/testimonials gaps.
- Services keep static category tree from `lib/data/services.ts`; WP only enriches image/href.
- FAQs: hardcoded question set filtered by presence in HTML.
- CTA band media uses a fixed Unsplash URL (not WP CTA images).
- About statement lines and some meta are fixed in the mapper.

**URL mapping:** `mapWpHref` converts same-origin WP absolute URLs to pathnames; `isAppRouteHref` decides Next `<Link>` vs `<a>`.

### Error / fallback behavior

- Failed homepage fetch throws from fetch helpers; footer catch returns static `footerCopy`.
- Graphic Design parser throws if hero/services intro cannot be parsed.
- Testimonials fall back to `lib/data/testimonials.ts` when WP parse yields none.
- Portfolio images: hover BG from HTML → media library name match → optional missing image.

### SEO metadata source

- Not live-fetched from Yoast at runtime.
- Hand-authored in `lib/seo/*` to mirror Yoast-compatible titles/descriptions/JSON-LD.
- Root `metadata` in `app/layout.tsx` provides site defaults.

---

## 4. Content/Data Model

### `HomepageContent` (`lib/wordpress/types.ts`)

Includes: `logos`, `logosCopy`, `about`, `metrics`, `metricsCopy`, `services`, `servicesCopy`, `portfolio`, `portfolioCopy`, `faqs`, `faqsCopy`, `cta`, `testimonials`, `testimonialsCopy`, `blogs`, `blogsCopy`, `contactCopy`, `footer`.

Related domain types live in `lib/data/*` (`ServiceCategory`, `BlogPost`, `FaqItem`, `PortfolioProject`, `Testimonial`, `AgencyMetric`, `PartnerLogo`).

### `GraphicDesignPageContent`

```ts
{ hero: { eyebrow, headline, body }, servicesIntro: { eyebrow, title, body } }
```

Remaining graphic-design sections use `lib/data/graphic-design-*.ts`.

### Other content sources (local, not WP)

| Area | Source |
| ---- | ------ |
| SEO page | `lib/data/seo-*.ts` |
| Locations | `lib/data/locations.ts` (Jacksonville, Blackburn, Islamabad) |
| Nav mega menus | `lib/data/services-mega-menu.ts`, `services-mega-ui.ts`, portfolio data |
| Scaffold pages | `lib/data/page-scaffold.ts` → shared CTA only |
| Contact form labels | `lib/data/contact.ts` (headings can override from WP) |
| Footer fallback | `lib/data/footer.ts` |

---

## 5. Route Architecture

Trailing slash on all routes. Status meanings:

- **Implemented** — real page composition beyond scaffold
- **Scaffolded** — `SiteHeader` + `ProfessionalCtaSection` via `pageScaffoldContent` only
- **System** — framework/API

| Route | Page file | Purpose | Data | Major components | Status |
| ----- | --------- | ------- | ---- | ---------------- | ------ |
| `/` | `app/page.tsx` | Homepage | WP homepage + local hero | `SiteHeader`, `Hero`, logos/about/metrics/services/portfolio/FAQ/CTA/testimonials/blogs/contact | Implemented (`revalidate: 300`) |
| `/graphic-design-solutions/` | `app/graphic-design-solutions/page.tsx` | Graphic design hub | WP page 2417 + local sections | Hero (SoftAurora), sub-services, showcase, approach, why-us, industries, CTA, FAQ | Implemented |
| `/digital-marketing/search-engine-optimization/` | `…/search-engine-optimization/page.tsx` | SEO services | Local `lib/data/seo-*` | SeoHero (WebThreads), sub-services, process, why-us, expert CTA, pricing, CTA, FAQ | Implemented |
| `/locations/` | `app/locations/page.tsx` | Locations index | `lib/data/locations` | LocationsHero, LocationCards, LocationsCta | Implemented |
| `/locations/[slug]/` | `app/locations/[slug]/page.tsx` | Location detail | Static params from `locations` | `LocationPage` | Implemented (SSG params) |
| `/about/` | `app/about/page.tsx` | About | Scaffold CTA | Header + CTA | Scaffolded |
| `/services/` | `app/services/page.tsx` | Services hub | Scaffold | Header + CTA | Scaffolded |
| `/blogs/` | `app/blogs/page.tsx` | Blog index | Scaffold | Header + CTA | Scaffolded |
| `/contact/` | `app/contact/page.tsx` | Contact page | Scaffold | Header + CTA | Scaffolded |
| `/projects/` | `app/projects/page.tsx` | Projects | Scaffold | Header + CTA | Scaffolded |
| `/appointment-booking/` | `app/appointment-booking/page.tsx` | Appointment | Scaffold | Header + CTA | Scaffolded |
| `/digital-marketing/` | `app/digital-marketing/page.tsx` | DM hub | Scaffold | Header + CTA | Scaffolded |
| `/digital-marketing/social-media-marketing/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/digital-marketing/ppc-ads-services/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/digital-marketing/content-marketing/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/digital-marketing/email-marketing/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/web-solutions/` | `app/web-solutions/page.tsx` | Web hub | WordPress page 2412 + local service data | Hero (Antigravity), sub-services carousel, Solar System tech stack, ScrollStack approach, Why Choose Us, CTA | Implemented |
| `/web-solutions/custom-website-development/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/web-solutions/ecommerce-website-development/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/web-solutions/shopify-store-development/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/web-solutions/wordpress-development/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/web-solutions/website-maintenance-and-support/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/web-solutions/website-hosting-and-domain-management/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/graphic-design-solutions/logo-design-service/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/graphic-design-solutions/brand-identity-design/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/graphic-design-solutions/social-media-post-design/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/graphic-design-solutions/website-ui-ux-design/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/graphic-design-solutions/infographic-design/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/graphic-design-solutions/print-design/` | … | Subservice | Scaffold | Header + CTA | Scaffolded |
| `/api/contact` | `app/api/contact/route.ts` | Contact POST | Email lib | — | Implemented |
| 404 | `app/not-found.tsx` | Not found | — | Header + `NotFoundExperience` | Implemented |

Homepage contact is the **homepage section** (`ContactSection`), not the scaffolded `/contact/` route.

---

## 6. Global Layout

### Root layout (`app/layout.tsx`)

- Fonts: **Bricolage Grotesque** (`--font-bricolage` / display), **Instrument Sans** (`--font-instrument` / body) via `next/font/google`, `display: "swap"`.
- `metadataBase`: `https://xoomplus.co.uk`.
- Default title template: `%s · Xoomplus`.
- Fetches footer via `getSiteFooterContent()`.
- Wraps children in `AppProviders`; renders `SiteFooter` once globally.

### `AppProviders` (`components/providers/app-providers.tsx`)

- `ThemeProvider` (`next-themes`): `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`.
- `AnimationProvider` (GSAP scroll lifecycle).
- `PageTransition` (~180ms opacity fade).
- `[data-animation-root]` wrapper for page content.
- `HeroEntrance` (homepage hero assemble).
- `PageBottomBlur`.
- **Native browser cursor only** — splash/custom cursor components exist but are **not mounted**.
- **No preloader** — retired (code remains for compatibility).

### Global vs page-specific

| Global | Page-specific |
| ------ | ------------- |
| Theme, fonts, globals.css | `SiteHeader` (imported per page) |
| Footer | Section stacks |
| Animation root + page fade | Heroes / WebGL backgrounds |
| Page bottom blur | Forms, maps, pricing |

---

## 7. Design System

Tokens live in `app/globals.css`. Teal brand: **#478997** (light) / **#3D7883** (dark).

### Brand colors

**Light (`:root`)**

| Token | Value |
| ----- | ----- |
| `--background` | `#f4f8f9` |
| `--foreground` | `#1a2e33` |
| `--card` | `#fafcfc` |
| `--primary` / `--accent` | `#478997` |
| `--primary-foreground` / `--accent-foreground` | `#f7fbfc` |
| `--secondary` | `#e4eef0` |
| `--muted` | `#e8f0f2` |
| `--muted-foreground` | `#5a7278` |
| `--hover` | `#d9eaed` |
| `--hover-foreground` | `#2f5f68` |
| `--destructive` | `#c0392b` |
| `--border` / `--input` | `color-mix` of `#1a2e33` at 14–16% |
| `--ring` | `#478997` |

**Dark (`.dark`)**

| Token | Value |
| ----- | ----- |
| `--background` | `#04070a` |
| `--foreground` | `#e8f0f2` |
| `--card` | `#0a1014` |
| `--primary` | `#3D7883` |
| `--accent` | `#4a8f9b` |
| `--secondary` | `#101820` |
| `--muted` | `#0d1419` |
| `--muted-foreground` | `#8eaaaf` |
| `--hover` | `#121c22` |
| `--destructive` | `#e05a4a` |
| `--ring` | `#3D7883` |

Chart / sidebar tokens also defined — use via Tailwind theme (`bg-primary`, `text-muted-foreground`, …).

### Typography

| Role | Token / utility | Notes |
| ---- | --------------- | ----- |
| Display / H1 | `--text-h1` / `.type-h1` | `clamp(2.5rem, 5vw, 4rem)`, weight 600, Bricolage |
| H2–H6 | `--text-h2` … `--text-h6` | Responsive clamps except H6 fixed `1.125rem` |
| Body | `--text-body` / `.type-body` | Instrument Sans, `clamp(1.0625rem, 1.35vw, 1.2rem)` |
| Small | `--text-small` / `.type-small` | `0.9375rem` |
| Meta / eyebrow caps | `--text-meta` / `.type-meta` | uppercase, tracked |
| Nav / buttons | `--text-nav` / `.type-nav` / `.type-button` | ~`1.02rem` |

Base `h1–h6` use display font. Prefer utilities over inventing sizes.

### Spacing

| Token | Value |
| ----- | ----- |
| `--section-y` | `5.5rem` |
| `--section-y-md` | `7.25rem` |
| `--section-y-lg` | `8.5rem` |
| `--section-y-compact` | `3rem` |
| `--section-y-compact-md` | `3.5rem` |
| `--title-gap` | `0.9rem` |
| `--btn-pad-y` / `--btn-pad-x` | `0.95rem` / `1.45rem` |

Many sections use CSS modules with these tokens or Tailwind spacing. Prefer matching neighboring sections over new scales.

### Container system

`.site-container`:

- Max width: `--layout-max` = **1400px**
- Mobile: `min(100% - 2rem, 1400px)`
- `md` (≥768px): `min(100% - 4rem, 1400px)`
- `lg` (≥1024px): `min(100% - 6rem, 1400px)`

Full-bleed heroes/effects sit outside the container; content shells use `.site-container` or equivalent.

### Border radius

| Token | Value |
| ----- | ----- |
| `--radius` | `0.25rem` (sharp editorial surfaces) |
| `--btn-radius` | `9999px` (pill buttons) |
| Theme radii | `--radius-sm` … `--radius-4xl` derived from `--radius` |

Service frost heroes use larger rounded panels (~`1.75rem` in module CSS) — page-specific, not a global token.

### Borders / shadows / effects

- Soft borders via `--border` color-mix.
- Primary buttons: accent gradient + multi-layer glow + optional pulse (`btn-glow-pulse`).
- Ghost buttons: translucent surface + accent border glow.
- Noise textures (`NoiseTexture`), glass/frost on service heroes (`backdrop-filter`).
- Dot pattern on homepage hero **mobile only**.
- Page bottom blur component globally.

### Motion tokens

`--motion-fast: 160ms`, `--motion-base: 500ms`, `--motion-slow: 750ms`, easings `--motion-ease` / `--motion-ease-out`.

### Section intro convention (required)

Use for section intros site-wide:

```tsx
<header data-reveal className={styles.intro}>
  <SectionEyebrow className={styles.eyebrow}>{copy.eyebrow}</SectionEyebrow>
  <h2 className={styles.title}>{copy.title}</h2>
  <p className={styles.body}>{copy.body}</p>
</header>
```

Intro title/body: `max-width: none; width: 100%` — no `ch` / `40rem` caps. See `.cursor/rules/section-intro-design.mdc`.

### Service page hero convention

Implemented pattern (Graphic Design SoftAurora, SEO WebThreads):

1. Full-bleed animated background
2. Centered frost card with backdrop blur (light + dark)
3. HOME chip + eyebrow
4. One H1 + one body
5. No extra stats/CTAs in first viewport

Do **not** put `transform` / `filter` / `will-change: transform` on the frost stack (breaks Chromium backdrop). Parallax only BG / text nodes.

---

## 8. Component Architecture

### Global / layout

| Component | Notes |
| --------- | ----- |
| `SiteHeader` | Client; desktop + mobile nav |
| `SiteFooter` | Client; props from WP footer or fallback |
| `BrandMark` | Logo mark |
| `ThemeToggle` | Light/dark |
| `AppProviders` | Theme + GSAP + fade |
| `ProfessionalCtaSection` | Shared CTA band |
| `SectionEyebrow` | Shared eyebrow pill |

### Homepage sections

`Hero`, `LogoLoopSection`, `AboutSection`, `MetricsSection`, `KineticTypeSection`, `ServicesSection`, `PortfolioSection`, `FaqSection`, `ProfessionalCtaSection`, `TestimonialsSection`, `BlogsSection`, `ContactSection`.

Heavy below-fold sections on home are `next/dynamic` with `ssr: true`.

### Service / SEO / graphic design

- Graphic: `graphic-design-*` under `components/sections/graphic-design/`
- SEO: `seo-*` under `components/sections/seo/`
- Shared: `FaqSection`, `PricingSection`, `ProfessionalCtaSection`

### Locations

`LocationsHero`, `LocationCards`, `LocationCard`, `LocationsCta`, `LocationPage`, `LocationMegaMenu`, maps.

### Animation / effects (reuse, don’t duplicate)

- GSAP wrappers: `AnimationProvider`, `HeroEntrance`, `HoverLift`, `Magnetic`
- Motion UI: `components/motion/*`
- Backgrounds: `liquid-ether`, `soft-aurora`, `web-threads` (plus unused/available: `prism`, `flying-posters`, splash/custom cursor)

### Utility UI

`AppLink`, buttons via `.btn-primary` / `.btn-ghost` / `.btn-link`, `Magnet`, `NoiseTexture`, `NumberTicker`, carousels, maps (`world-map`, `dotted-map`).

**Rule:** Search `components/` and `lib/data` before creating parallels.

---

## 9. Header / Navigation

### Desktop (`lg+`)

- Aceternity-style `Navbar` / `NavBody` (`resizable-navbar.tsx`) — **fixed** top, z-50.
- Shrinks/styles after scroll > 100px (Motion scroll listener; boolean state only).
- Center: Home, About, **Services** mega, **Portfolios** mega, **Locations** mega, Blogs, Contact.
- Right: theme toggle + “Get a Quote” → `/appointment-booking/`.
- Mega data from `services-mega-menu` / portfolio / locations.

### Mobile (`< lg`)

- Custom `MobileNav`, portaled to `document.body` (preserves backdrop-filter).
- Accordion megas for Services / Portfolios / Locations.
- Scroll state for frosted bar (`scrollY > 100`).
- Locks body with `data-mobile-nav-open` when open.

### Shared

- `BrandMark` logo.
- `mapWpHref` for WP-origin links in mega content.
- Entrance hook: `data-nav-entrance` for GSAP HeroEntrance.

---

## 10. Page Transition System

**Intent:** fast, lightweight, ~150–250ms fade; no navigation blocking.

**Implementation:**

| File | Role |
| ---- | ---- |
| `components/animations/PageTransition.tsx` | On pathname change, opacity fade via `data-page-fade` |
| `components/animations/page-transition.css` | `out` → opacity 0 (no transition); `in` → opacity 1 over **180ms** |
| `lib/animations/page-transition.ts` | `PAGE_FADE_MS = 180`; clears legacy overlay artifacts |

Does **not** intercept clicks or delay routing. Respects `prefers-reduced-motion`. Rapid navigations cancel prior timers/rAF. Legacy leave/enter play functions are no-ops / cleanup-only.

---

## 11. Animation Architecture

| System | Where | Role | Caution |
| ------ | ----- | ---- | ------- |
| GSAP + ScrollTrigger | `lib/animations/*`, `AnimationProvider` | `data-animate` / `data-motion` / parallax | Coalesced `refreshScrollTrigger` via rAF |
| `useSectionReveal` | Section intros | `[data-reveal]` / stagger | Prefer over ad-hoc scroll state |
| HeroEntrance | Homepage | Assemble nav/body/trust/actions/visuals; **never** opacity-0 on `[data-lcp]` | LCP-critical |
| Motion (framer-motion package) | Nav, mobile menu, some UI | Presence / layout micro-interactions | Keep scoped |
| CSS | globals + modules | Buttons, reduced-motion kill switch | Prefer tokens |
| WebGL backgrounds | effects/* | Hero atmospheres | Gate by device; dynamic `ssr:false` |
| Kinetic type | `KineticTypeSection` | Scroll typography | Feature-flagged in motion config |
| Preloader | Present in repo | **Retired** — not mounted | Do not re-enable casually |

Central intensity: `lib/animations/config.ts` — tiers `desktop | tablet | mobile | reduced`; features (magnetic, parallax, kinetic, custom cursor, …) disabled on smaller/reduced tiers.

---

## 12. Liquid Ether

**Protected visual system.** Modify only when explicitly requested.

| Item | Detail |
| ---- | ------ |
| Location | `components/effects/liquid-ether.jsx` + `liquid-ether.css` |
| Used in | `components/sections/hero.tsx` only |
| Load | `dynamic(..., { ssr: false, loading: () => null })` |
| Tech | Three.js WebGL fluid simulation |
| Mount gate | Desktop fine pointer, not compact ≤768, not `saveData`, `deviceMemory >= 4`, not reduced motion |
| Fallback | CSS radial accent gradient |

**Homepage props (current):**

- Dark colors: `["#2f6b76", "#3D7883", "#6aadb8"]`
- Light colors: `["#478997", "#2f6b76", "#5a9aa5"]`
- `mouseForce={18}`, `cursorSize={110}`, `resolution={0.22}`, `iterationsViscous/Poisson={12}`, `BFECC={false}`, `autoDemo={false}`
- `backgroundColor` light `#f4f8f9` / dark `#04070a`
- Positioned absolute full-bleed under veil; decorative (`aria-hidden`)

**Do not:** replace, rewrite shaders, add another WebGL layer on top, or raise cost without request.

---

## 13. Scrolling & Interaction Performance

- **Native window scrolling** — `html { scroll-behavior: auto }` (avoids lag with ScrollTrigger).
- No custom smooth-scroll library in the active provider stack.
- Scroll listeners: Motion `useScroll` in nav for boolean “scrolled” only (guarded equality).
- GSAP ScrollTrigger for reveals/parallax; refresh coalesced.
- Section reveals via Intersection/ScrollTrigger patterns in `useSectionReveal` — not React state per scroll pixel.
- Prefer animating **transform** and **opacity**.

**Avoid:** React state on every scroll event; layout thrash (`top`/`left`/`width`/`height` animations); forced sync layout in scroll handlers.

---

## 14. Performance Rules — MUST FOLLOW

The site prioritizes Core Web Vitals (LCP, INP, CLS), fast first render, minimal JS/hydration, and efficient animation.

**AI agents MUST:**

- Reuse existing components and WP data helpers
- Prefer Server Components; add `"use client"` only when required
- Avoid unnecessary dependencies and duplicate API fetches
- Avoid scroll-driven React state and global state unless necessary
- Keep hero LCP text as real HTML — never hide primary H1 with opacity 0
- Dynamic-import heavy WebGL; gate by device capability
- Use Next/Image for content images when appropriate; honor remotePatterns
- Prefer CSS transform/opacity; keep route fade lightweight
- Preserve intended visuals — do not “optimize” by deleting Liquid Ether / service hero effects unasked

**Goal:** maximum perceived and real performance while preserving design and interactions.

---

## 15. Responsive Design

Breakpoints used in practice:

| Breakpoint | Usage |
| ---------- | ----- |
| 768px | Tailwind `md`, motion mobile/tablet split, Liquid Ether compact gate |
| 1024px (`lg`) | Desktop vs mobile nav switch; container padding step |

- Homepage: Liquid Ether off on coarse/compact; DotPattern mobile-only.
- Service WebGL: softer gates than Liquid Ether (may run on some tablets).
- Motion features strip on mobile/reduced (`motionConfig.features`).
- Services/graphic carousels adapt for touch.
- Typography scales via `clamp` tokens.

---

## 16. SEO Architecture

| Piece | Implementation |
| ----- | -------------- |
| Defaults | `app/layout.tsx` metadata |
| Homepage | `lib/seo/homepage.ts` — absolute title, canonical, robots, OG, Twitter, JSON-LD graph |
| Graphic Design | `lib/seo/graphic-design-solutions.ts` — metadata + Product JSON-LD |
| SEO services | `lib/seo/search-engine-optimization.ts` — metadata + Product JSON-LD |
| Locations | `lib/seo/locations.ts` — index + per-slug metadata |
| JSON-LD injection | `<script type="application/ld+json">` in page files |
| Sitemap / robots.txt | **Not present** in the App Router tree |

SEO copy is static TypeScript mirroring production WP/Yoast — not fetched live.

---

## 17. Image & Asset Strategy

| Source | Handling |
| ------ | -------- |
| WordPress uploads | `xoomplus.co.uk/wp-content/uploads/**` allowed in `next.config.ts` |
| Unsplash | `images.unsplash.com` allowed (hero showcase, about, CTA) |
| Other | `concisemedico.co.uk` uploads allowed |
| Local brand | `public/brand/xoomplus-logo-*.svg` |
| Hero showcase | Plain `<img>` with eager/lazy — decorative, `fetchPriority="low"` |
| Logo loop | WP logo URLs only (no fake brand placeholders) |

Agents adding images should: use allowed hosts or local `public/`; prefer appropriately sized assets; mark LCP-critical wisely; keep decorative images `alt=""` / `aria-hidden` when appropriate.

---

## 18. Forms & User Interaction

### Homepage contact (`ContactSection`)

- Client form → `POST /api/contact` JSON `{ name, email, subject, message }`.
- Client + server validation; field errors; status `idle | loading | ok | error`.
- API (`runtime: "nodejs"`) → `sendContactEmail` (Resend if `RESEND_API_KEY`, else SMTP).
- Map embed + Magnet micro-interaction on submit control.

### Appointment

- Route `/appointment-booking/` is **scaffolded** (CTA only) — no dedicated booking form implementation yet.

### Theme

- `ThemeToggle` via `next-themes` class strategy.

---

## 19. Accessibility

Practices present in code:

- Semantic landmarks (`header`/`main`/`footer`/`section`), heading hierarchy on sections
- `aria-hidden` on decorative WebGL/veil/particles
- `aria-label` on trust strip; form labels/ids via `useId`
- Focus-visible styles on `.btn-primary` / `.btn-ghost`
- `prefers-reduced-motion`: global CSS kill-switch; GSAP/page fade/WebGL skip paths
- Link vs button semantics in nav/CTAs

Known constraints: custom cursor CSS exists but is inactive; WebGL is decorative only; some marketing SVGs are `aria-hidden`.

---

## 20. Current Pages / Components Status

| Area | Status | Notes |
| ---- | ------ | ----- |
| Global Header | Implemented | Desktop mega + mobile portal nav |
| Footer | Implemented | WP-driven via homepage fetch; static fallback |
| CTA | Implemented | `ProfessionalCtaSection` reused |
| Homepage | Implemented | WP-mapped sections; local hero |
| About | Scaffolded | Header + CTA only |
| Services | Scaffolded | Hub route scaffolded; homepage services section live |
| Digital Marketing | Partial | SEO child implemented; hub + other children scaffolded |
| Web Solutions | Scaffolded | All routes scaffolded |
| Graphic Design | Partial | Hub implemented; child service routes scaffolded |
| Projects | Scaffolded | Portfolio section live on homepage |
| Blogs | Scaffolded | Homepage blogs from WP posts |
| Contact | Partial | Homepage form live; `/contact/` scaffolded |
| Appointment | Scaffolded | Quote CTA target only |
| 404 | Implemented | Particles + copy |
| WordPress API | Implemented | Homepage + graphic design + footer |
| Animations | Implemented | GSAP + Motion + CSS; preloader/cursors retired |
| Performance | In progress | Dynamic imports, revalidate 300, WebGL gates, LCP-safe hero |

---

## 21. Planned / Pending Work

**Identifiable from repo only:**

| Item | Evidence | Bucket |
| ---- | -------- | ------ |
| Fill scaffolded marketing routes | Many pages use `pageScaffoldContent` | Planned / incomplete |
| Appointment booking UX | Route exists, scaffold only | Planned / incomplete |
| Dedicated `/contact` page body | Scaffold; form lives on home | Incomplete |
| Blog index / post templates | `/blogs/` scaffold; home uses posts API | Incomplete |
| Sitemap / robots routes | Not in `app/` | Unknown / not started |
| Re-enable preloader or custom cursor | Code present, explicitly not mounted | Unknown — do not assume |

Do not invent roadmap items beyond the above.

---

## 22. AI Agent Development Rules

### Before changing anything

1. Inspect the relevant existing component.
2. Understand its data flow (WP vs `lib/data`).
3. Search for reusable components/utilities.
4. Check whether the feature already exists.
5. Make the smallest appropriate change.
6. Preserve visual language and tokens.
7. Preserve WP architecture and performance characteristics.

### Do not

- Rewrite working architecture without cause
- Replace Liquid Ether / global layout / WP layer casually
- Duplicate components or invent design tokens
- Add heavy libraries for simple UI
- Convert Server Components to client unnecessarily
- Add scroll listeners or animation-frame React state without need
- Hardcode WP content that should come from the API (or fake API responses)
- Break trailing-slash URL conventions

### Prefer

- Existing sections, tokens, WP helpers, SEO modules
- Server-side data + `revalidate`
- CSS transform/opacity
- Service hero + section intro conventions already documented
- Type-safe props matching `lib/wordpress/types` and `lib/data`

---

## 23. Important Protected Systems

Treat these as high-risk / high-coordination changes:

1. **WordPress REST + HTML parse layer** (`lib/wordpress/*`)
2. **Root layout + `AppProviders` + footer pipeline**
3. **Header / mega menu behavior**
4. **Liquid Ether + homepage hero LCP contract**
5. **Page transition (~180ms opacity)**
6. **GSAP AnimationProvider / ScrollTrigger refresh coalescing**
7. **Design tokens & typography in `globals.css`**
8. **Service frost-hero backdrop-filter rules**
9. **Contact email API / env configuration**
10. **`next.config.ts` image remotePatterns & trailingSlash**

Do not rewrite casually; extend carefully.

---

## 24. File/Component Quick Reference

| File / Component | Purpose | Important notes |
| ---------------- | ------- | --------------- |
| `app/layout.tsx` | Root shell | Fonts, footer, providers |
| `app/globals.css` | Design system | Single source for tokens |
| `app/page.tsx` | Homepage | WP content + dynamic below-fold |
| `lib/wordpress/config.ts` | WP origin + page IDs | Public constants |
| `lib/wordpress/get-homepage-content.ts` | Homepage fetch/map | `cache()`, revalidate 300 |
| `lib/wordpress/parse-homepage-html.ts` | Elementor HTML parse | Fragile regex — edit carefully |
| `lib/wordpress/get-graphic-design-content.ts` | GD page fetch/parse | Page 2417 |
| `lib/wordpress/urls.ts` | Href mapping | Use for WP links |
| `components/sections/hero.tsx` | Home hero | Liquid Ether + LCP H1 |
| `components/effects/liquid-ether.jsx` | WebGL fluid | **Protected** |
| `components/layout/site-header.tsx` | Nav entry | Desktop + mobile |
| `components/layout/site-footer.tsx` | Footer | Global from layout |
| `components/providers/app-providers.tsx` | Client shell | No custom cursor / preloader |
| `components/animations/PageTransition.tsx` | Route fade | 180ms opacity |
| `lib/animations/config.ts` | Motion tiers | Feature flags by viewport |
| `lib/seo/homepage.ts` | Home SEO | JSON-LD + metadata |
| `app/api/contact/route.ts` | Form API | Resend/SMTP |
| `lib/data/page-scaffold.ts` | Scaffold CTA | Temporary page filler |
| `lib/data/locations.ts` | Studios catalog | SSG slugs |
| `components/ui/section-eyebrow.tsx` | Section labels | Required for intros |

---

## 25. AI Agent Quick Start

## If You Are a New AI Agent

Before making changes:

1. Read `context.md`.
2. Inspect the relevant existing files.
3. Follow the established architecture.
4. Reuse existing components.
5. Reuse the WordPress data layer.
6. Follow the existing design system.
7. Preserve animations and interactions unless explicitly asked to change them.
8. Protect LCP/INP/CLS.
9. Avoid unnecessary dependencies.
10. Make the smallest clean change.
11. Verify responsive behavior.
12. Verify that existing pages/components are not broken.

> `context.md` describes the current project architecture and conventions. When the codebase and this document disagree, the actual implementation is the final source of truth. Update `context.md` when a significant architectural, design-system, API, or performance decision changes.
