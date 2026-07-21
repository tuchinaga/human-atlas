"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { EntityImage } from "@/components/EntityImage";
import type { PersonIndexEntry } from "@/db/queries";

function yearOf(date: string | null): number | null {
  if (!date) return null;
  const y = new Date(date).getUTCFullYear();
  return Number.isNaN(y) ? null : y;
}

export function PeopleIndexView({ people }: { people: PersonIndexEntry[] }) {
  const { locale } = useLanguage();

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        {locale === "ja" ? "人物" : "People"}
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {locale === "ja" ? "人物をたどる" : "Follow a Person"}
      </h1>
      <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-fg-soft">
        {locale === "ja"
          ? `生年順に並んだ${people.length}人。`
          : `${people.length} people, sorted by birth year.`}
      </p>

      <ul className="mt-10 max-w-2xl divide-y divide-border border-y border-border">
        {people.map((p) => {
          const name = (locale === "ja" && p.nameJa) || p.name;
          const occupations: string[] = JSON.parse(
            (locale === "ja" && p.occupationsJsonJa) || p.occupationsJson || "[]",
          );
          const birthYear = yearOf(p.birthDate);
          const deathYear = yearOf(p.deathDate);
          return (
            <li key={p.slug}>
              <Link
                href={`/people/${p.slug}`}
                className="group flex items-center gap-4 py-3 transition-colors hover:bg-bg-raised"
              >
                <div className="w-12 shrink-0">
                  <EntityImage image={p.image} alt={name} aspect="aspect-square" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] text-fg transition-colors group-hover:text-accent">
                    {name}
                  </p>
                  {occupations.length > 0 && (
                    <p className="truncate text-[12px] text-fg-muted">{occupations.join(" · ")}</p>
                  )}
                </div>
                <p className="tabular shrink-0 text-[12px] text-fg-muted">
                  {birthYear ?? "?"}
                  {deathYear ? `–${deathYear}` : ""}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
