# Portfolio — Dhanapal Selvam

Personal portfolio site for a **Full Stack Developer | AI Systems Builder**, built with Angular and Tailwind. Dark neon UI, glassmorphism, animated backgrounds (mesh gradients, cursor-following color, particles), scroll reveals, and Angular Animations.

**Repository:** [github.com/Dhanapals03/portfolio](https://github.com/Dhanapals03/portfolio)

## Features

- Single-page layout: Hero, About, Achievements, Skills, Projects, Experience, Contact
- **Tailwind CSS v4** with `@tailwindcss/postcss` (see `.postcssrc.json`)
- Contact form with lightweight CSS transitions
- Responsive navigation with mobile menu
- Content driven from one data file for easy updates

## Tech stack

| Layer | Details |
|--------|---------|
| Framework | Angular 19 (standalone components) |
| Styling | Tailwind CSS v4, SCSS for components |
| Animation | CSS transitions & keyframes |

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

Open **http://localhost:4200/**. `npm start` runs the site and contact mail API together.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Angular dev server + mail API |
| `npm run build` | Production build → `dist/` |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright E2E (API + navigation) |

## Contact form email setup

The form posts to `POST /api/contact`. A small Express server (`server/index.js`) sends mail via SMTP to `CONTACT_TARGET_EMAIL`.

### 1) Configure environment

```bash
cp .env.example .env
```

Set Gmail SMTP (App Password, 16 characters with no spaces) and `CONTACT_TARGET_EMAIL`. Multiple recipients: comma-separated addresses.

### 2) Run locally

```bash
npm start
```

Angular proxies `/api` to the mail server on port `4301`. Submit the form at `http://localhost:4200` and check your inbox.

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
npm run build
```

Artifacts are written to `dist/dhanapal-portfolio/browser/`. The contact API is **not** included in that folder—you must deploy the mail server (or a platform that runs it) alongside the static site.

## Production deployment

### Option A — Vercel (static site + API)

This repo includes `vercel.json` and `api/index.js`, which re-exports the Express mail API for serverless routes.

1. Import the repository in [Vercel](https://vercel.com).
2. Set environment variables (Project → Settings → Environment Variables):

| Variable | Example / notes |
|----------|-----------------|
| `FRONTEND_ORIGIN` | `https://your-domain.vercel.app` (must match the deployed site origin) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password |
| `SMTP_FROM` | Same as `SMTP_USER` (optional) |
| `CONTACT_TARGET_EMAIL` | Inbox for form submissions |
| `NODE_ENV` | `production` |

3. Deploy. Vercel serves the Angular build and routes `/api/*` to the serverless handler.

Update `og:url`, `og:image`, and `twitter:image` in `src/index.html` if your production domain differs from the default GitHub Pages URL.

### Option B — Static host + API elsewhere

1. Deploy `dist/dhanapal-portfolio/browser/` to GitHub Pages, Netlify, S3, etc.
2. Run `server/index.js` on Cloud Run, Railway, or a VPS (`NODE_ENV=production`, `MAIL_API_PORT` as required).
3. Proxy `/api` from the static host to the mail API (Netlify redirects, nginx, CDN rules).

### Required production env vars

Same as `.env.example`. In production, `FRONTEND_ORIGIN` must be the exact browser origin (scheme + host + port) so CORS accepts form posts. Non-browser clients without an `Origin` header are rejected when `NODE_ENV=production`.

Keep `.env` out of the repo.

## Deploy notes

- Configure `base href` in `angular.json` / build flags if deploying to a subpath.
- Replace `public/og-image.svg` (or add `og-image.png` at 1200×630) and update meta tags in `src/index.html`.
- Add a **favicon** under `public/` if needed.

## License

Personal portfolio — all rights reserved unless you add an explicit license file.

---

Crafted with Angular & Tailwind.
