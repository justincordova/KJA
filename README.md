# Koenigsegg Jesko Absolut — Scrollytelling Experience

A scrollytelling website exploring the Koenigsegg Jesko Absolut, the fastest car Koenigsegg will ever build.

## Live Site

**[View the scrollytelling experience →](https://justincordova.github.io/KJA/)**

Scroll through the site to experience the narrative unfold with scroll-driven animations, parallax backgrounds, and cinematic transitions.

## About

This project was built using a **spec-driven development** workflow with AI assistance, following the process taught in Professor Keith Williams' course at NJIT. The scrollytelling framework is based on the [scrollytelling_spec_driven](https://github.com/kaw393939/scrollytelling_spec_driven) template.

### Tech Stack

- **Next.js 16** — App Router with static export for GitHub Pages
- **React 19** — Server components + client components for animation
- **TypeScript** — Strict mode with Zod validation
- **Framer Motion** — Scroll-driven animations (`useScroll`, `useTransform`, `useInView`)
- **Markdown** — Content as the source of truth, split into slides on `---`
- **CSS** — Custom properties with dark automotive theme

### How Scrollytelling Works

1. Markdown content is split on `---` into individual slides
2. Each slide is wrapped in a `PresentationSlide` with sticky positioning
3. `useScroll` tracks scroll progress per slide (0 → 1)
4. `Reveal` components animate content into view as the user scrolls
5. `ParallaxImage` creates depth with velocity-driven image movement
6. A dot navigation rail shows current slide position

### Project Structure

```
├── content/
│   ├── home.md              # Main scrollytelling presentation (13 slides)
│   └── pages/about.md       # Standard layout content page
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/
│   │   ├── layouts/         # PresentationLayout, StandardLayout
│   │   ├── motion/          # PresentationSlide, Reveal, ParallaxImage
│   │   ├── markdown/        # MarkdownRenderer
│   │   └── ui/              # ContextualLink
│   └── lib/
│       ├── content/         # Parser, repository, schema (Zod)
│       └── site-config.ts   # Base path for GitHub Pages
├── .github/workflows/       # GitHub Pages deployment
└── package.json
```

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
```

## Deployment

Automatically deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.
