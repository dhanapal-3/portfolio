# Portfolio — Dhanapal Selvam

Personal portfolio site for a **Full Stack Developer | AI Systems Builder**, built with Angular and Tailwind. Dark neon UI, glassmorphism, animated backgrounds (mesh gradients, cursor-following color, particles), scroll reveals, and Angular Animations.

**Repository:** [github.com/Dhanapals03/portfolio](https://github.com/Dhanapals03/portfolio)

## Features

- Single-page layout: Hero, About, Achievements, Skills, Projects, Experience, Contact
- **Tailwind CSS v4** with `@tailwindcss/postcss` (see `.postcssrc.json`)
- **Angular Animations** on the contact CTA (`provideAnimations()` in `app.config.ts`)
- Responsive navigation with mobile menu
- Content driven from one data file for easy updates

## Tech stack

| Layer | Details |
|--------|---------|
| Framework | Angular 19 (standalone components) |
| Styling | Tailwind CSS v4, SCSS for components |
| Animation | `@angular/animations`, CSS transitions & keyframes |

## Prerequisites

- **Node.js** 18+ (LTS recommended; avoid odd-numbered non-LTS for production per Node guidance)
- **npm** 9+

## Quick start

```bash
git clone https://github.com/Dhanapals03/portfolio.git
cd portfolio
npm install
npm start
```

Open **http://localhost:4200/**. The dev server reloads when files change.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` / `ng serve` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Unit tests (Karma) |

## Customizing content

Edit **`src/app/data/portfolio.data.ts`**:

- Profile name, role, location, tagline  
- Achievements, skills, projects, experience bullets  
- **Contact:** email and LinkedIn (replace placeholders before publishing)

## Project structure (high level)

```
src/
├── app/
│   ├── components/       # Sections + layout (hero, projects, etc.)
│   ├── data/             # portfolio.data.ts
│   ├── directives/       # e.g. scroll reveal
│   ├── app.component.*
│   └── app.config.ts
├── styles.css            # Tailwind + global utilities
└── index.html
```

## Production build

```bash
ng build
```

Artifacts are written to `dist/dhanapal-portfolio/`. Serve that folder from any static host (GitHub Pages, Netlify, Vercel, etc.).

## Deploy notes

- Configure `base href` if deploying to a subpath.
- Add a real **favicon** under `public/` if needed.
- Keep API keys and secrets out of the repo; this app has no backend by default.

## License

Personal portfolio — all rights reserved unless you add an explicit license file.

---

Crafted with Angular & Tailwind.
