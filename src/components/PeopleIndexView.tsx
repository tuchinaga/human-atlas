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

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {people.map((p) => {
          const name = (locale === "ja" && p.nameJa) || p.name;
          const occupations: string[] = JSON.parse(
            (locale === "ja" && p.occupationsJsonJa) || p.occupationsJson || "[]",
          );
          const birthYear = yearOf(p.birthDate);
          const deathYear = yearOf(p.deathDate);
          return (
            <Link key={p.slug} href={`/people/${p.slug}`} className="group block">
              <EntityImage image={p.image} alt={name} aspect="aspect-square" />
              <p className="mt-2 truncate text-[13px] text-fg-soft transition-colors group-hover:text-fg">
                {name}
              </p>
              <p className="tabular truncate text-[11px] text-fg-muted">
                {birthYear ?? "?"}
                {deathYear ? `–${deathYear}` : ""}
                {occupations.length > 0 && ` · ${occupations[0]}`}
              </p>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
