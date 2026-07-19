# Levain — Bakery Landing Page (React + Tailwind CSS + GSAP)

Converted from the original Figma Make export into a plain **React + Vite + Tailwind CSS v4 + GSAP** project, using **npm** as the package manager.

## What changed
- Same exact UI/design (colors, fonts, layout, copy) as the original.
- The moving marquee/ticker strip below the hero section has been **removed**.
- All entrance/scroll animations (hero text, section reveals, card stagger, testimonial crossfade, mobile menu) are now powered by **GSAP** + **ScrollTrigger** instead of plain CSS transitions/keyframes.
- Removed Figma Make-specific tooling (custom vite plugins, `.figma` config, `pnpm-lock.yaml`) — this is now a clean, standard project.

## Setup

```bash
npm install
npm run dev       # start dev server
npm run build      # production build (outputs to dist/)
npm run preview    # preview the production build
```

## Stack
- React 19
- Tailwind CSS v4 (`@tailwindcss/vite`)
- GSAP + ScrollTrigger
- Vite + TypeScript
