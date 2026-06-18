# Harshita Guduru — Portfolio

[![CI](https://github.com/guduruharshita/harshita-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/guduruharshita/harshita-portfolio/actions)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](src/App.tsx)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](tsconfig.json)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](vite.config.ts)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)](tailwind.config.js)

Personal portfolio site built with **React 18 + TypeScript strict mode + Vite + Tailwind CSS 3**. Single-page application with smooth scroll navigation, dark/light theme, scroll-reveal animations, and project flip-cards.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 with hooks (no class components) |
| Language | TypeScript 5.5 strict mode |
| Build | Vite 5 — sub-2s production builds |
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
