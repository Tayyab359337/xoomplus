# Service page hero pattern

Use this whenever building a **service / solutions page hero** (SEO, digital marketing, web, design, etc.).

## Visual contract (from reference)

Heroes are one full-viewport composition:

1. **Full-bleed animated background** — a React Bits / npm background effect filling the section edge-to-edge (behind everything).
2. **Centered frost card** — rounded panel (~`1.75rem` radius) with **backdrop blur in both light and dark**.
3. **Badge pill** — `HOME` (or chip) + short eyebrow line.
4. **One H1** — service name; use global type scale (`--text-h1`).
5. **One body paragraph** — supporting copy; use `--text-body`.
6. **Centered text**, generous padding, no extra cards/stats/CTAs in the first viewport.

Do **not** invent a different hero layout per page. Only the **background effect** (and page-specific copy / colors) changes.

## What the user will provide

For each new service page, expect:

- Route / slug
- Copy (chip, eyebrow, headline, body) — or WP later
- **Background package only**, e.g.  
  `npx shadcn@latest add @react-bits/<Name>-JS-CSS`

Agent steps:

1. Install the background component (prefer `components/effects/`, add `"use client"` if needed).
2. Clone the hero shell from an existing service hero (`seo-hero` or `graphic-design-hero`).
3. Swap the BG component + theme-aware palette.
4. Keep frost / badge / H1 / body structure identical.

## Backdrop blur rules (required)

Frost glass **must** use `backdrop-filter` / `-webkit-backdrop-filter` in **light and dark**.

Never apply `transform`, `filter`, or `will-change: transform` on:

- the section
- the shell
- the frost card / stack that owns the blur

Those break Chromium backdrop sampling. Parallax only the **background layer** and individual text nodes (badge / h1 / body), not the frost stack.

Also avoid `overflow: hidden` on the frost stack if it kills blur; radius on `.frost` is enough.

## Structure checklist

```
<section>                 <!-- no transform -->
  <div BG layer />        <!-- animated effect; may parallax -->
  <div veil />
  <div shell>             <!-- no transform -->
    <div stack>           <!-- no transform; frost sibling -->
      <div frost />       <!-- backdrop-filter light + dark -->
      <badge />
      <h1 />
      <p />
    </div>
  </div>
</section>
```

## Typography

Use tokens from `app/globals.css` (`--text-h1`, `--text-body`, `--text-small`, etc.). Do not invent one-off hero font sizes.

## Examples

| Page | Route | Background |
|------|--------|------------|
| Graphic Design | `/graphic-design-solutions/` | SoftAurora |
| SEO Services | `/digital-marketing/search-engine-optimization/` | WebThreads |

New pages: same hero chrome, different background component.

---

# Section intro width (headings + body)

For **all site section intros** (homepage, service pages, locations, CTA bands, FAQ, etc.):

## Visual contract (from reference)

1. **Eyebrow** — always `SectionEyebrow` from `@/components/ui/section-eyebrow` (pill + shimmer). Never hand-roll accent uppercase `<p>` labels — including locations heroes and logo strip.
2. **Heading** — `h1`/`h2` with global type tokens (`--text-h1` / `--text-h2`, `--font-display`).
3. **Body under the heading** — supporting paragraph with `--text-body` / muted color.
4. **Width** — heading **and** the text below it span the **full content shell** (or the full frost card / intro column they sit in). Long body lines should use nearly the full horizontal space — not a narrow `ch`-capped column.

```css
.intro {
  max-width: none;
  width: 100%;
}

.title {
  max-width: none;
  text-wrap: wrap; /* not balance when full-width */
}

.body {
  max-width: none;
}
```

Do **not** constrain section intros with values like `max-width: 14ch` / `34ch` / `40rem` on title or body.

## Eyebrow rules

- Default variant: `mark` (pill + arrow) for section intros.
- Hero homepage eyebrow may use `variant="bare"` (no arrow).
- Service frost-card heroes keep the HOME chip + label badge (not `SectionEyebrow`) — that is hero chrome, not a section intro.

## Layout notes

- Prefer stacked intros (eyebrow → title → body). Do not put body in a narrow right column beside the title.
- Centered intros (showcase, pricing, locations CTA) may keep `text-align: center`, but title + body still use full shell/card width (`max-width: none`).
- FAQ aside copy is full-column width by default.
