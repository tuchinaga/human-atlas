"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import type { SearchResults } from "@/db/queries";

const GROUP_LABELS: Record<string, { en: string; ja: string }> = {
  year: { en: "Year", ja: "年" },
  people: { en: "People", ja: "人物" },
  works: { en: "Works", ja: "作品" },
  places: { en: "Places", ja: "場所" },
  events: { en: "Events", ja: "出来事" },
  movements: { en: "Movements", ja: "ムーブメント" },
};

export function ExploreResults({ query, results }: { query: string; results: SearchResults }) {
  const { locale } = useLanguage();

  const totalCount =
    (results.year ? 1 : 0) +
    results.people.length +
    results.works.length +
    results.places.length +
    results.events.length +
    results.movements.length;

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        {locale === "ja" ? "検索" : "Search"}
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        &ldquo;{query}&rdquo;
      </h1>

      {totalCount === 0 ? (
        <p className="mt-8 max-w-md text-[14px] leading-relaxed text-fg-soft">
          {locale === "ja"
            ? "一致する記録が見つかりませんでした。北斎、1889、パリなどで試してみてください。"
            : "No matching records. Try something like Hokusai, 1889, or Paris."}
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {results.year && (
            <ResultGroup groupKey="year" locale={locale}>
              <ResultLink href={`/year/${results.year}`} primary={String(results.year)} />
            </ResultGroup>
          )}

          {results.people.length > 0 && (
            <ResultGroup groupKey="people" locale={locale}>
              {results.people.map((p) => (
                <ResultLink
                  key={p.slug}
                  href={`/people/${p.slug}`}
                  primary={(locale === "ja" && p.nameJa) || p.name}
                />
              ))}
            </ResultGroup>
          )}

          {results.works.length > 0 && (
            <ResultGroup groupKey="works" locale={locale}>
              {results.works.map((w) => (
                <ResultLink
                  key={w.slug}
                  href={`/works/${w.slug}`}
                  primary={(locale === "ja" && w.titleJa) || w.title}
                />
              ))}
            </ResultGroup>
          )}

          {results.places.length > 0 && (
            <ResultGroup groupKey="places" locale={locale}>
              {results.places.map((p) => (
                <ResultLink
                  key={p.slug}
                  href={`/places/${p.slug}`}
                  primary={(locale === "ja" && p.nameJa) || p.name}
                />
              ))}
            </ResultGroup>
          )}

          {results.events.length > 0 && (
            <ResultGroup groupKey="events" locale={locale}>
              {results.events.map((e) => (
                <ResultLink
                  key={e.slug}
                  href={`/events/${e.slug}`}
                  primary={(locale === "ja" && e.titleJa) || e.title}
                />
              ))}
            </ResultGroup>
          )}

          {results.movements.length > 0 && (
            <ResultGroup groupKey="movements" locale={locale}>
              {results.movements.map((m) => (
                <ResultLink
                  key={m.slug}
                  href={`/movements/${m.slug}`}
                  primary={(locale === "ja" && m.nameJa) || m.name}
                />
              ))}
            </ResultGroup>
          )}
        </div>
      )}
    </PageShell>
  );
}

function ResultGroup({
  groupKey,
  locale,
  children,
}: {
  groupKey: keyof typeof GROUP_LABELS;
  locale: "en" | "ja";
  children: React.ReactNode;
}) {
  const label = GROUP_LABELS[groupKey][locale];
  return (
    <section className="max-w-xl">
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">{label}</p>
      <ul className="mt-3 divide-y divide-border border-y border-border">{children}</ul>
    </section>
  );
}

function ResultLink({ href, primary }: { href: string; primary: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between py-3 text-[14.5px] text-fg-soft transition-colors hover:text-fg"
      >
        <span>{primary}</span>
        <span aria-hidden>→</span>
      </Link>
    </li>
  );
}
