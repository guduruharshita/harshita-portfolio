# Harshita Guduru — Portfolio

[![CI](https://github.com/guduruharshita/harshita-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/guduruharshita/harshita-portfolio/actions)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](src/App.tsx)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](tsconfig.json)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](vite.config.ts)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)](tailwind.config.js)
[![Bundle](https://img.shields.io/badge/Bundle-190KB-green?logo=vite)](vite.config.ts)

Personal portfolio site built with **React 18 + TypeScript strict mode + Vite + Tailwind CSS 3**. Single-page application with smooth scroll navigation, dark/light theme, scroll-reveal animations, and project flip-cards.

## Why Build From Scratch

Generic portfolio builders (Wix, Webflow, LinkedIn profile) offer zero technical signal to a technical recruiter. A portfolio that *is itself* the engineering artifact removes that gap: the TypeScript strictness, the Vite bundle optimization, the IntersectionObserver-based scroll reveals, and the CSS variable theming system are all observable in the source — anyone who clones the repo sees the same engineering discipline they would expect on the job. The single `src/lib/profile.ts` data file means all content is updatable without touching any component logic, which is the same separation of concerns expected in production frontend codebases.

## Component Architecture

```
App.tsx (SPA root)
│
├── Navbar
│   ├── Logo + nav links (smooth-scroll anchors)
│   ├── Dark/light theme toggle (CSS variables swap)
│   └── Active section tracker (scroll position → IntersectionObserver)
│
├── Hero
│   ├── Profile photo (public/profile.jpg, fallback: "HG" initials)
│   ├── Animated counters — ease-out cubic interpolation on section entry
│   └── Marquee strip — looping tech-stack ticker
│
├── Experience
│   └── Timeline cards — scroll-reveal fade-in with configurable delay
│
├── Projects
│   ├── Flip-cards grid — CSS 3D transform on hover
│   └── Full-detail modal — triggered on click, shows highlights + GitHub link
│
├── Skills
│   └── Animated progress bars — fill triggered by IntersectionObserver
│
├── Publications
│   └── Research citation block with journal metadata
│
└── Contact
    └── Social link badges (GitHub, LinkedIn, Email)

lib/profile.ts ──── single source of truth for all content
    ├── name, title, tagline, contact
    ├── experience[]  (company, role, dates, bullets)
    ├── projects[]    (title, description, highlights[], tags[], github)
    ├── skills[]      (name, proficiency 0–100)
    └── publications[]
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 with hooks (no class components) |
| Language | TypeScript 5.5 strict mode |
| Build | Vite 5 — sub-2s production builds, 190KB bundle |
| Styling | Tailwind CSS 3 + CSS custom properties for theming |
| Fonts | Playfair Display (headings) + Manrope (body) via Google Fonts |
| Icons | lucide-react |
| CI | GitHub Actions: tsc typecheck + vite build |

## Quick Start

```bash
npm install
npm run dev
# http://localhost:5173
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | tsc typecheck + Vite production build |
| `npm run typecheck` | TypeScript type-check without emit |
| `npm run preview` | Preview the production build |

## Project Structure

```
harshita-portfolio/
├── public/
│   └── profile.jpg          # Profile photo (add your own)
├── src/
│   ├── App.tsx               # Main SPA — all sections + hooks
│   ├── index.css             # CSS variables for theming + Tailwind directives
│   ├── main.tsx              # React 18 createRoot entrypoint
│   └── lib/
│       └── profile.ts        # All profile content — name, experience, projects, skills
├── .github/workflows/ci.yml  # GitHub Actions: typecheck + build
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## Customizing

All content lives in **`src/lib/profile.ts`** — update that single file to change:
- Name, title, tagline, contact details
- Work experience and education
- Projects (title, description, highlights, tags, GitHub link)
- Skills with proficiency percentages
- Publications

## Profile Photo

Place a photo named `profile.jpg` in the `public/` folder. If missing, the hero section renders "HG" as a text fallback.

## Features

- **Dark / Light theme** — respects `prefers-color-scheme`, toggleable via navbar
- **Scroll-reveal animations** — IntersectionObserver-based fade-in with configurable delay
- **Animated counters** — ease-out cubic interpolation on section entry
- **Project flip-cards** — hover to flip, click for full-detail modal with GitHub link
- **Sticky nav** — active section tracking via scroll position
- **Marquee strip** — looping tech-stack ticker between hero and experience sections
- **Animated skill bars** — progress fills on scroll entry

## CI

GitHub Actions runs on every push to `main` and `claude/**` branches:
1. `tsc --noEmit` — catches type errors before deploy
2. `vite build` — validates the full production bundle compiles cleanly

## Future Improvements

- **MDX blog** — Add a writing/notes section using `@mdx-js/react` so technical posts live alongside the portfolio rather than on a separate platform
- **Project case studies** — Expand each project card into a full case study page: problem → approach → result → lessons learned
- **Vercel Analytics** — Integrate `@vercel/analytics` to understand which sections and projects receive the most attention from visitors
- **Automated OG images** — Use `@vercel/og` to generate per-project Open Graph images for rich link previews when sharing on LinkedIn or X
- **Contact form** — Serverless function backed by Resend API to handle contact form submissions without exposing an email address in source

---

**Harshita Guduru** — [GitHub](https://github.com/guduruharshita) · [LinkedIn](https://linkedin.com/in/guduruharshita) · [Email](mailto:guduruharshita2001@gmail.com)
