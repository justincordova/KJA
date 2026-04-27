---
title: "About This Project"
layout: "standard"
summary: "How this scrollytelling experience was built."
seo:
  title: "About — Koenigsegg Jesko Absolut Scrollytelling"
  description: "Learn about the spec-driven development process behind this Koenigsegg Jesko Absolut scrollytelling website."
---

# About This Project

This website is a scrollytelling experience about the Koenigsegg Jesko Absolut, built as part of a web development course at NJIT.

## What is Scrollytelling?

Scrollytelling is a web design technique where content is revealed progressively as the user scrolls. Instead of a traditional static page, elements animate into view — text fades in, images parallax, and the narrative unfolds like a cinematic experience.

Companies like Apple, Tesla, and The New York Times use this technique to tell compelling product stories.

## How This Was Built

This project uses a spec-driven development workflow with AI assistance:

- **Framework:** Next.js 16 with React 19 and TypeScript
- **Animations:** Framer Motion for scroll-driven animations
- **Content:** Markdown with YAML frontmatter, validated by Zod
- **Hosting:** GitHub Pages via static export
- **Design:** Dark automotive theme with gold accent typography

## The Process

Following the spec-driven development methodology:

1. Research and gather content about the subject
2. Define the story arc across slides
3. Write markdown content with frontmatter metadata
4. Build reusable components for presentation and animation
5. Validate at every step with build-time checks

## Credits

- Vehicle data sourced from [Koenigsegg Automotive AB](https://www.koenigsegg.com)
- Background images from Unsplash
- Scrollytelling framework inspired by [Professor Keith Williams' scrollytelling_spec_driven](https://github.com/kaw393939/scrollytelling_spec_driven) template
