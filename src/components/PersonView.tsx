"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";

export type PersonViewData = {
  name: string;
  nameJa: string | null;
  birthDate: string | null;
  deathDate: string | null;
  biography: string | null;
  biographyJa: string | null;
  occupations: string[];
};

export type JourneyStop = {
  startDate: string | null;
  endDate: string | null;
  confidence: string;
  placeName: string;
  placeNameJa: string | null;
  placeSlug: string;
};

export type WorkLink = { slug: string; title: string; titleJa: string | null };

export function PersonView({
  person,
  journey,
  works,
}: {
  person: PersonViewData;
  journey: JourneyStop[];
  works: WorkLink[];
}) {
  const { locale } = useLanguage();
  const name = (locale === "ja" && person.nameJa) || person.name;
  const bio = (locale === "ja" && person.biographyJa) || person.biography;

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        Person
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {name}
      </h1>
      <p className="tabular mt-3 text-[13px] text-fg-muted">
        {person.birthDate?.slice(0, 4) ?? "?"}
        {" – "}
        {person.deathDate?.slice(0, 4) ?? ""}
        {person.occupations.length > 0 && (
          <span className="ml-3 text-fg-soft">
            {person.occupations.join(" · ")}
          </span>
        )}
      </p>

      {bio && (
        <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-fg-soft">
          {bio}
        </p>
      )}

      {journey.length > 0 && (
        <section className="mt-12 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            Geographic journey
          </p>
          <ol className="tabular mt-4 space-y-3 border-l border-border pl-5">
            {journey.map((stop, i) => (
              <li key={i} className="relative">
                <span
                  className="absolute -left-[23px] top-1.5 h-1.5 w-1.5 rounded-full bg-fg-muted"
                  aria-hidden
                />
                <Link
                  href={`/places/${stop.placeSlug}`}
                  className="text-[14px] text-fg transition-colors hover:text-accent"
                >
                  {(locale === "ja" && stop.placeNameJa) || stop.placeName}
                </Link>
                <p className="text-[12px] text-fg-muted">
                  {stop.startDate?.slice(0, 4)}
                  {stop.endDate ? `–${stop.endDate.slice(0, 4)}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {works.length > 0 && (
        <section className="mt-12 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            Works
          </p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {works.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/works/${w.slug}`}
                  className="flex items-center justify-between py-3 text-[14px] text-fg-soft transition-colors hover:text-fg"
                >
                  <span>{(locale === "ja" && w.titleJa) || w.title}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}
