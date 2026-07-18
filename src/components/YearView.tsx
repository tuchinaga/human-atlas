"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { MeanwhileThread } from "@/components/MeanwhileThread";
import { YearCard } from "@/components/YearCard";
import { CATEGORY_COLOR_VAR } from "@/lib/categories";
import { Breadcrumb } from "@/components/Breadcrumb";
import { parseTrail, extendTrail, type TrailStep } from "@/lib/trail";
import type { YearCategoryCard } from "@/db/queries";
import type { Category } from "@/db/schema";

export type AgeRow = {
  name: string;
  nameJa: string | null;
  slug: string;
  age: number;
};

export function YearView({
  year,
  cards,
  ages,
  trail,
}: {
  year: string;
  cards: YearCategoryCard[];
  ages: AgeRow[];
  trail?: string;
}) {
  const { t, locale } = useLanguage();
  const yearNum = Number(year);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const breadcrumbSteps = parseTrail(trail);
  const yearStep: TrailStep = { type: "year", slug: year, label: year };

  const categoriesPresent = useMemo(
    () => [...new Set(cards.map((c) => c.category))],
    [cards],
  );
  const countriesPresent = useMemo(
    () => [...new Set(cards.map((c) => c.country).filter((c): c is string => !!c))].sort(),
    [cards],
  );

  const filteredCards = cards.filter(
    (c) =>
      (!activeCategory || c.category === activeCategory) &&
      (!activeCountry || c.country === activeCountry),
  );

  return (
    <PageShell>
      <Breadcrumb steps={breadcrumbSteps} />
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

      {cards.length === 0 ? (
        <div className="mx-auto mt-14 max-w-xl rounded-sm border border-border bg-bg-raised p-6 text-center">
          <p className="text-[13.5px] leading-relaxed text-fg-soft">
            {year} has no ingested records yet. The seeded demonstration
            year is{" "}
            <Link href="/year/1889" className="underline underline-offset-2">
              1889
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <section className="mt-14">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                {t.meanwhile.label}
              </p>
            </div>

            {(categoriesPresent.length > 1 || countriesPresent.length > 1) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <FilterChip
                  active={!activeCategory}
                  onClick={() => setActiveCategory(null)}
                  label={locale === "ja" ? "すべて" : "All"}
                />
                {categoriesPresent.map((cat) => (
                  <FilterChip
                    key={cat}
                    active={activeCategory === cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    label={t.categories[cat]}
                    dotColor={CATEGORY_COLOR_VAR[cat]}
                  />
                ))}
                {countriesPresent.length > 1 && (
                  <span className="mx-1 h-4 w-px bg-border" aria-hidden />
                )}
                {countriesPresent.map((country) => (
                  <FilterChip
                    key={country}
                    active={activeCountry === country}
                    onClick={() => setActiveCountry(activeCountry === country ? null : country)}
                    label={country}
                  />
                ))}
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card) => (
                <YearCard
                  key={`${card.kind}-${card.slug}`}
                  card={card}
                  currentTrail={trail}
                  fromStep={yearStep}
                />
              ))}
            </div>
            {filteredCards.length === 0 && (
              <p className="mt-6 text-[13px] text-fg-muted">
                {locale === "ja"
                  ? "この条件に一致する記録はありません。"
                  : "Nothing matches this filter."}
              </p>
            )}
          </section>

          {ages.length > 0 && (
            <section className="mt-16 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                Age comparison
              </p>
              <ul className="tabular mt-4 divide-y divide-border border-y border-border text-[14px]">
                {ages.map((p) => (
                  <li
                    key={p.slug}
                    className="flex items-center justify-between py-2.5"
                  >
                    <Link
                      href={`/people/${p.slug}?trail=${encodeURIComponent(extendTrail(trail, yearStep))}`}
                      className="font-sans text-fg-soft transition-colors hover:text-fg"
                    >
                      {(locale === "ja" && p.nameJa) || p.name}
                    </Link>
                    <span>{p.age}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </PageShell>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] transition-colors ${
        active
          ? "border-fg bg-fg text-bg"
          : "border-border text-fg-soft hover:border-fg hover:text-fg"
      }`}
    >
      {dotColor && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: active ? "currentColor" : dotColor }}
          aria-hidden
        />
      )}
      {label}
    </button>
  );
}
