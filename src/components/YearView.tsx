"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { MeanwhileThread } from "@/components/MeanwhileThread";
import { YearCard } from "@/components/YearCard";
import { YEAR_1889_CARDS, YEAR_1889_AGES } from "@/lib/seed-1889";
import { ScaffoldView } from "@/components/ScaffoldView";

export function YearView({ year }: { year: string }) {
  const { t, locale } = useLanguage();
  const yearNum = Number(year);
  const hasSeedData = year === "1889";

  if (!hasSeedData) {
    return (
      <ScaffoldView
        eyebrow={t.nav.timeline}
        title={year}
        description="Every year in the 1750–1950 MVP range resolves to this same view once its category cards are ingested. 1889 is seeded with demonstration data — try it below."
        route={`/year/${year}`}
        notes={[
          "Renders World History, Japan, Art, Music, Literature, Science and Architecture cards for this year.",
          "Zoom levels: Civilization → Century → Decade → Year.",
          "Drag, type, or use previous/next to change year without losing view context.",
        ]}
      />
    );
  }

  return (
    <PageShell>
      <div className="flex items-baseline justify-between">
        <Link
          href={`/year/${yearNum - 1}`}
          className="text-[12px] text-fg-muted transition-colors hover:text-fg"
          aria-label="Previous year"
        >
          ← {yearNum - 1}
        </Link>
        <h1 className="tabular font-display text-6xl tracking-tight md:text-8xl">
          {year}
        </h1>
        <Link
          href={`/year/${yearNum + 1}`}
          className="text-[12px] text-fg-muted transition-colors hover:text-fg"
          aria-label="Next year"
        >
          {yearNum + 1} →
        </Link>
      </div>

      <MeanwhileThread className="mx-auto mt-8 h-4 w-full max-w-2xl" />

      <section className="mt-14">
        <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
          {t.meanwhile.label}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {YEAR_1889_CARDS.map((card) => (
            <YearCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
          Age comparison
        </p>
        <ul className="tabular mt-4 divide-y divide-border border-y border-border text-[14px]">
          {YEAR_1889_AGES.map((person) => (
            <li
              key={person.name}
              className="flex items-center justify-between py-2.5"
            >
              <span className="font-sans text-fg-soft">
                {locale === "ja" ? person.nameJa : person.name}
              </span>
              <span>{person.age}</span>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
