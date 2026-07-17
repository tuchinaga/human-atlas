# Human Atlas — MVP Scaffold

Explore the Journey of Humanity — a bilingual (EN/JA), museum-quality
interface for exploring human history as a network of simultaneous
people, places, works and events, rather than a single timeline.

This is the **application shell**: design tokens, routing, layout,
i18n, and light/dark theming, per the product spec (sections 1–10, 27,
29). The Year view (`/year/1889`) is seeded with real demonstration
data from section 28 to show the flagship experience end to end;
every other entity route renders a scaffold explaining what will
render there once the ingestion pipeline (section 22) is built.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's here

- **Design tokens** — `src/app/globals.css`. Warm near-neutral palette,
  Fraunces (display serif) + IBM Plex Sans/JP (body) + IBM Plex Mono
  (tabular dates), all self-hosted via `@fontsource` — no external
  font requests. Category indicator colors per section 4. Dark mode
  via `data-theme` attribute, not just `prefers-color-scheme`, so the
  header toggle works.
- **i18n** — `src/lib/language-provider.tsx` + `src/messages/{en,ja}.json`.
  A lightweight dictionary system (swap for `next-intl` when routes need
  locale-prefixed URLs). `resolveLocalizedName()` implements the
  name/nameJa/nativeName fallback described in section 21.
- **Signature element** — `src/components/MeanwhileThread.tsx`. A thin
  hairline with dated nodes in category colors: a literal picture of
  the product's thesis ("history is a network, not a column of dates"),
  reused at reduced opacity across entity pages.
- **Routes** — every route from section 29 exists and builds:
  `/`, `/explore`, `/year/[year]`, `/people/[slug]`, `/works/[slug]`,
  `/places/[slug]`, `/events/[slug]`, `/movements/[slug]`, `/compare`,
  `/journeys/[slug]`, `/about`, `/sources`, `/rights`, plus `/saved`
  for the mobile bottom nav.
- **Responsive shell** — fixed header with desktop nav on `md:` and
  up; a five-item bottom nav (`src/components/MobileNav.tsx`) below
  that, matching the suggested mobile IA in section 6.
- **Image rights** — no images are fetched, faked, or generated
  anywhere in this scaffold. `FeaturedJourney.tsx` shows the neutral
  placeholder pattern every entity card should use until a cleared
  Image Asset (section 19) is attached.

## Not in this scaffold

Per section 27 (MVP scope) and the "review the plan first" nature of
a shell: no database, ingestion pipeline, search index, map (MapLibre),
or network graph rendering yet. Development order in section 30 lines
up with a sensible next-step order from here: normalized DB schema →
seed dataset → wire the Year view to real data → Meanwhile engine →
map and artist journey → search.
