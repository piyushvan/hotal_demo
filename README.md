# The Blackstone Hotel — Website

A luxury hotel showcase built with **Next.js 16**, **Tailwind CSS v4**, and scroll-driven video playback.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animation**: GSAP + Lenis smooth scroll
- **Language**: TypeScript

## Getting Started (local dev)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel

1. Push this repo to GitHub / GitLab / Bitbucket.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Vercel will auto-detect Next.js — just click **Deploy**. No extra env vars needed.

> **Note**: The `public/scrolling/` folder contains ~94MB of scroll-driven videos committed directly to the repo. Vercel will serve them from its CDN edge network with proper byte-range support (configured in `vercel.json`).

## Project Structure

```
public/
  gallary/       → Hotel gallery images (33 images)
  scrolling/     → 5 scroll-driven video segments (~94MB)

src/
  app/           → Next.js App Router pages & layout
  components/
    canvas/      → ScrollVideo component (video + rAF loop)
    sections/    → Page sections (Hero, Gallery, Dining, Rooms, etc.)
  hooks/         → Shared React hooks
  lib/           → Shared utilities
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
