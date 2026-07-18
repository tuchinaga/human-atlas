"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { MeanwhileThread } from "@/components/MeanwhileThread";
import { YearCard } from "@/components/YearCard";
import type { YearCategoryCard } from "@/db/queries";

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
}: {
  year: string;
  cards: YearCategoryCard[];
  ages: AgeRow[];
}) {
  const { t, locale } = useLanguage();
  const yearNum = Number(year);

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
            <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
              {t.meanwhile.label}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <YearCard key={`${card.kind}-${card.slug}`} card={card} />
              ))}
            </div>
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
                      href={`/people/${p.slug}`}
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
