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

## Database

The app has a real data layer, running on PostgreSQL per the spec's
recommended stack (section 24).

- **ORM**: Drizzle (`src/db/schema.ts`) — chosen over Prisma because
  Prisma's engine binaries download from a domain that wasn't reachable
  while building this scaffold; Drizzle has no such requirement. The spec
  explicitly lists Drizzle as an accepted alternative.
- **Driver**: `pg` (node-postgres) via `drizzle-orm/node-postgres`.
- **Schema**: mirrors spec section 21 (Person, Place, LocationPeriod, Work,
  Event, Movement, Relationship, ImageAsset), with one simplification —
  multi-valued simple fields (aliases, occupations, nationalities) and
  `sources` are JSON text columns rather than fully normalized join
  tables, to keep the MVP schema readable. Structural relationships the UI
  actually queries — creators, journeys, event places/participants — are
  real foreign keys and join tables.
- **Seed data**: `src/db/seed.ts` populates the section 28 demonstration
  set (Van Gogh's full geographic journey, Hokusai, Mahler, the Eiffel
  Tower, the Meiji Constitution, Impressionism as a movement, and one
  documented cross-cultural influence relationship).

### Local setup

Point `DATABASE_URL` at any Postgres instance — a local server or a
hosted one (Neon and Supabase both have free tiers that work well with
Netlify). Copy `.env.example` to `.env.local` and fill it in, or export
`DATABASE_URL` directly. Without it, the app falls back to
`postgresql://postgres:localdev@localhost:5432/human_atlas`.

```bash
cp .env.example .env.local   # then edit DATABASE_URL
npm install
npm run db:push              # apply schema.ts to the database
npm run db:seed              # populate demonstration data
npm run dev
```

Other useful commands:

```bash
npm run db:studio            # browse the database in Drizzle Studio
```

### Wired to real data

`/year/[year]`, `/people/[slug]`, `/works/[slug]`, `/places/[slug]` and
`/events/[slug]` query the database and fall back to the explanatory
scaffold view when a record doesn't exist yet. Try:
`/year/1889`, `/people/vincent-van-gogh`, `/people/katsushika-hokusai`,
`/works/the-starry-night`, `/works/eiffel-tower`, `/places/paris`,
`/events/promulgation-of-the-meiji-constitution`.

### Deploying to Netlify

1. Provision a Postgres database (Neon or Supabase are the easiest —
   both have generous free tiers and no server to manage).
2. Set `DATABASE_URL` in Netlify's site environment variables.
3. Run `npm run db:push` and `npm run db:seed` once, locally, pointed at
   that same `DATABASE_URL` (or via a one-off Netlify build hook), to
   create the tables and load the demonstration data.
4. Deploy as before — Netlify's Next.js runtime handles the rest, no
   further configuration needed.
