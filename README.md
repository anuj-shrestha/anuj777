# anuj777

Personal site for Anuj Shrestha — engineer, songwriter, maker. Built with Next.js 14, TypeScript, Tailwind. Static-exportable; deploy anywhere.

## Run locally

```bash
cd anuj777
npm install
npm run dev
```

Open http://localhost:3000.

## Build for production

```bash
npm run build
```

Static files land in `out/`. Drop on Vercel, Netlify, GitHub Pages, or S3.

## Stack

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS — custom warm-cream + terracotta palette
- Typography: Fraunces (display serif) + Inter (body) + JetBrains Mono — loaded from Google Fonts

## Structure

```
src/
├── app/
│   ├── layout.tsx          Root layout, fonts, nav, footer
│   ├── page.tsx            Home — hero, featured projects, songs, writing previews
│   ├── globals.css         Tailwind + custom utilities
│   ├── about/page.tsx      Long-form bio + values
│   ├── projects/
│   │   ├── page.tsx        All projects
│   │   └── [slug]/page.tsx Project detail (case studies)
│   ├── songs/page.tsx      Songs — shipped + in-progress + channel link
│   └── writing/
│       ├── page.tsx        Essay index
│       └── [slug]/page.tsx Essay detail
├── components/             Shared UI
└── data/                   Single source of truth — projects, songs, writing, profile
```

## Editing content

All content lives in `src/data/`. Edit those files; pages re-render automatically.

- `src/data/profile.ts` — name, bio, contact, social
- `src/data/projects.ts` — projects with slug, summary, role, year, body
- `src/data/songs.ts` — song titles, language, status, theme, optional links (YouTube)
- `src/data/writing.ts` — essays with slug, summary, body

## Deploying

**Custom domain (recommended):** push to Vercel or Netlify; point your domain at it. Leave `basePath` empty in `next.config.mjs`.

**GitHub Pages at `/anuj777`:** uncomment `basePath: "/anuj777"` in `next.config.mjs`, run `npm run build`, push the `out/` folder to a `gh-pages` branch (or use a GitHub Action).

## TODOs before going live

- [ ] Add per-song YouTube URLs in `src/data/songs.ts` (currently they all point to the channel)
- [ ] Confirm Devanagari spellings of song titles before publishing
- [ ] Add a real headshot / hero image to `public/`
- [ ] Replace draft essay bodies with finished versions
- [ ] Add Programiz screenshots / GIFs where you have rights to use them
- [ ] Set up favicon and Open Graph image
