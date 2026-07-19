# Levain Bakery — Landing Page

React + Tailwind CSS + GSAP landing page for Levain Bakery. Converted from a Figma Make export into a clean npm-based project.

## Stack
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- GSAP + ScrollTrigger (animations)

## Setup
```bash
npm install
npm run dev       # local dev server
npm run build     # production build (dist/)
npm run preview   # preview the build
```

## Structure
src/
App.tsx        # whole page (header, hero, menu, testimonials, contact, footer)
index.css      # Tailwind theme (colors, fonts) + base styles
main.tsx       # app entry

No components folder — page is a single file split into clearly commented sections. Split into `src/sections/` if it grows.

## 3. Design Tokens (`src/index.css`)

Tailwind v4 config lives directly in CSS via `@theme`, not a JS config file:

```css
@theme {
  --color-cream: #FAF7F2;
  --color-cream-dark: #F2EDE4;
  --color-charcoal: #1A1614;
  --color-charcoal-soft: #2D2522;
  --color-terra: #C4622D;
  --color-terra-light: #D97B47;
  --color-wheat: #E8D5B7;
  --color-warm-gray: #8B7D74;
  --color-warm-gray-light: #C5B8B0;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

Each `--color-*` token is auto-exposed as a Tailwind utility (`bg-terra`, `text-cream`, `border-wheat`, etc.). Fonts are loaded from Google Fonts via `@import` at the top of `index.css`; `Playfair Display` is used for headings (applied inline per-heading via `style={{ fontFamily: ... }}`, matching the original design file), `Inter` is the body font set globally on `<body>`.

If the client wants a rebrand later, this file is the single source of truth for colors/fonts — no need to touch component markup.

---

## 4. Page Sections (`src/App.tsx`)

In DOM order:

1. **Header / Nav** — fixed, transparent over the hero, gains a blurred cream background once `window.scrollY > 40` (tracked via a `scroll` listener + `useState`). Includes a mobile hamburger menu (`menuOpen` state, GSAP fade-in on open).
2. **Hero** — full-bleed background image, headline, subcopy, two CTAs. Elements are pre-tagged with `hero-*` classes used only as GSAP animation hooks (not styling).
3. **Featured Trio** — first 3 products from `PRODUCTS`, large image cards with hover zoom.
4. **About** — two-column story block with stat counters (16+, 4am, 100%).
5. **Full Menu Grid** — all 6 `PRODUCTS` in a responsive grid.
6. **Testimonials** — 3-quote crossfade carousel with dot navigation (click-to-switch, no autoplay).
7. **Specials / CTA banner** — solid terracotta band promoting the weekend basket.
8. **Contact** — address/hours/phone/email list + a static contact form (no backend wiring).
9. **Footer** — brand blurb, nav/social link columns, copyright line.

## Animations
Handled with GSAP, not CSS transitions:
- **Hero** — timeline fades/slides content in on load.
- **`data-reveal`** — any element with this attribute fades up once when scrolled into view.
- **`data-reveal-group` / `data-reveal-item`** — used on card grids so children stagger in one after another.
- **Testimonials** — crossfade driven by GSAP `opacity` tweens, not CSS.
- **Mobile menu** — fades/slides in on open.

