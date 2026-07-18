"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { EntityImage, type ImageAssetData } from "@/components/EntityImage";
import { WorldMap } from "@/components/WorldMap";
import { CATEGORY_COLOR_VAR } from "@/lib/categories";
import { Breadcrumb } from "@/components/Breadcrumb";
import { parseTrail, extendTrail, type TrailStep } from "@/lib/trail";
import type { YearCategoryCard } from "@/db/queries";

export type PersonViewData = {
  slug: string;
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
  reason: string | null;
  reasonJa: string | null;
  confidence: string;
  placeName: string;
  placeNameJa: string | null;
  placeSlug: string;
  latitude: number | null;
  longitude: number | null;
};

export type WorkLink = {
  slug: string;
  title: string;
  titleJa: string | null;
  creationStartDate: string | null;
};

export type MovementLink = { slug: string; name: string; nameJa: string | null };

export type ContemporaryPerson = {
  slug: string;
  name: string;
  nameJa: string | null;
  birthDate: string | null;
  deathDate: string | null;
};

function yearOf(date: string | null): number | null {
  return date ? Number(date.slice(0, 4)) : null;
}

export function PersonView({
  person,
  journey,
  works,
  image,
  movements,
  contemporaries,
  currentLocation,
  spotlightYear,
  meanwhile,
  trail,
}: {
  person: PersonViewData;
  journey: JourneyStop[];
  works: WorkLink[];
  image: ImageAssetData | null;
  movements: MovementLink[];
  contemporaries: ContemporaryPerson[];
  currentLocation: JourneyStop | null;
  spotlightYear: number | null;
  meanwhile: YearCategoryCard[];
  trail?: string;
}) {
  const { locale, t } = useLanguage();
  const name = (locale === "ja" && person.nameJa) || person.name;
  const bio = (locale === "ja" && person.biographyJa) || person.biography;
  const birthYear = yearOf(person.birthDate);
  const deathYear = yearOf(person.deathDate);
  const ageAtDeath = birthYear && deathYear ? deathYear - birthYear : null;

  const breadcrumbSteps = parseTrail(trail);
  const personStep: TrailStep = { type: "person", slug: person.slug, label: name };
  const trailFromHere = extendTrail(trail, personStep);
  const linkWithTrail = (href: string) => `${href}?trail=${encodeURIComponent(trailFromHere)}`;

  return (
    <PageShell>
      <Breadcrumb steps={breadcrumbSteps} />
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">Person</p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {name}
      </h1>
      <p className="tabular mt-3 text-[13px] text-fg-muted">
        {birthYear ?? "?"} – {deathYear ?? ""}
        {person.occupations.length > 0 && (
          <span className="ml-3 text-fg-soft">{person.occupations.join(" · ")}</span>
        )}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
        {/* Left: biography, journey, works */}
        <div className="min-w-0">
          {bio && (
            <p className="max-w-xl text-[14.5px] leading-relaxed text-fg-soft">{bio}</p>
          )}

          {journey.length > 0 && (
            <section className="mt-12">
              <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                Geographic journey
              </p>

              {journey.some((s) => s.latitude !== null && s.longitude !== null) && (
                <div className="mt-4">
                  <WorldMap
                    points={journey
                      .filter(
                        (s): s is JourneyStop & { latitude: number; longitude: number } =>
                          s.latitude !== null && s.longitude !== null,
                      )
                      .map((s, i) => ({
                        lat: s.latitude,
                        lng: s.longitude,
                        label: (locale === "ja" && s.placeNameJa) || s.placeName,
                        href: linkWithTrail(`/places/${s.placeSlug}`),
                        order: i,
                      }))}
                    path
                    height="420px"
                    initialZoom={2}
                  />
                </div>
              )}

              <ol className="tabular mt-5 space-y-4 border-l border-border pl-5">
                {journey.map((stop, i) => {
                  const stopYear = yearOf(stop.startDate);
                  const endYear = yearOf(stop.endDate);
                  const ageStart = birthYear && stopYear ? stopYear - birthYear : null;
                  const ageEnd = birthYear && endYear ? endYear - birthYear : null;
                  const reason = (locale === "ja" && stop.reasonJa) || stop.reason;
                  return (
                    <li key={i} className="relative">
                      <span
                        className="absolute -left-[23px] top-1.5 h-1.5 w-1.5 rounded-full bg-fg-muted"
                        aria-hidden
                      />
                      <Link
                        href={linkWithTrail(`/places/${stop.placeSlug}`)}
                        className="text-[14.5px] text-fg transition-colors hover:text-accent"
                      >
                        {(locale === "ja" && stop.placeNameJa) || stop.placeName}
                      </Link>
                      <p className="mt-0.5 text-[12px] text-fg-muted">
                        {stopYear}
                        {endYear ? `–${endYear}` : ""}
                        {ageStart !== null && (
                          <span className="ml-2">
                            · {locale === "ja" ? "年齢" : "Age"} {ageStart}
                            {ageEnd !== null && ageEnd !== ageStart ? `–${ageEnd}` : ""}
                          </span>
                        )}
                      </p>
                      {reason && (
                        <p className="mt-1 max-w-md text-[13px] leading-relaxed text-fg-soft">
                          {reason}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {works.length > 0 && (
            <section className="mt-12 max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">Works</p>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {works.map((w) => {
                  const workYear = yearOf(w.creationStartDate);
                  const age = birthYear && workYear ? workYear - birthYear : null;
                  return (
                    <li key={w.slug}>
                      <Link
                        href={linkWithTrail(`/works/${w.slug}`)}
                        className="flex items-center justify-between py-3 text-[14px] text-fg-soft transition-colors hover:text-fg"
                      >
                        <span>{(locale === "ja" && w.titleJa) || w.title}</span>
                        <span className="tabular text-[12px] text-fg-muted">
                          {workYear}
                          {age !== null && ` · ${locale === "ja" ? "年齢" : "age"} ${age}`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        {/* Right: sticky context panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-6 border-t border-border pt-6 lg:border-t-0 lg:pt-0">
            {image && (
              <EntityImage
                image={image}
                alt={`${name}${locale === "ja" ? "の肖像" : ", portrait"}`}
                aspect="aspect-square"
                className="max-w-[220px]"
              />
            )}

            <dl className="space-y-3 text-[13px]">
              <div>
                <dt className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
                  {locale === "ja" ? "生没年" : "Lifespan"}
                </dt>
                <dd className="tabular mt-0.5 text-fg-soft">
                  {birthYear ?? "?"} – {deathYear ?? (locale === "ja" ? "現在" : "present")}
                  {ageAtDeath !== null && (
                    <span className="ml-2 text-fg-muted">
                      ({ageAtDeath} {locale === "ja" ? "歳" : "years"})
                    </span>
                  )}
                </dd>
              </div>

              {person.occupations.length > 0 && (
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
                    {locale === "ja" ? "分野" : "Discipline"}
                  </dt>
                  <dd className="mt-0.5 text-fg-soft">{person.occupations.join(" · ")}</dd>
                </div>
              )}

              {movements.length > 0 && (
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
                    {locale === "ja" ? "ムーブメント" : "Movement"}
                  </dt>
                  <dd className="mt-0.5 flex flex-wrap gap-x-2 gap-y-1">
                    {movements.map((m) => (
                      <Link
                        key={m.slug}
                        href={linkWithTrail(`/movements/${m.slug}`)}
                        className="text-fg-soft underline underline-offset-2 transition-colors hover:text-fg"
                      >
                        {(locale === "ja" && m.nameJa) || m.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}

              {currentLocation && (
                <div>
                  <dt className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
                    {locale === "ja" ? "最後の所在地" : "Last known location"}
                  </dt>
                  <dd className="mt-0.5">
                    <Link
                      href={linkWithTrail(`/places/${currentLocation.placeSlug}`)}
                      className="text-fg-soft underline underline-offset-2 transition-colors hover:text-fg"
                    >
                      {(locale === "ja" && currentLocation.placeNameJa) ||
                        currentLocation.placeName}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>

            {contemporaries.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
                    {locale === "ja" ? "同時代の人物" : "Contemporaries"}
                  </p>
                  <Link
                    href="/network"
                    className="text-[11px] text-fg-muted transition-colors hover:text-fg"
                  >
                    {locale === "ja" ? "ネットワーク →" : "Network →"}
                  </Link>
                </div>
                <ul className="tabular mt-2 space-y-1.5 text-[13px]">
                  {contemporaries.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={linkWithTrail(`/people/${c.slug}`)}
                        className="flex items-center justify-between text-fg-soft transition-colors hover:text-fg"
                      >
                        <span className="truncate pr-2">
                          {(locale === "ja" && c.nameJa) || c.name}
                        </span>
                        <span className="shrink-0 text-fg-muted">
                          {yearOf(c.birthDate)}–{yearOf(c.deathDate) ?? ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {meanwhile.length > 0 && spotlightYear && (
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
                    {t.meanwhile.label}
                  </p>
                  <Link
                    href={linkWithTrail(`/year/${spotlightYear}`)}
                    className="text-[11px] text-fg-muted transition-colors hover:text-fg"
                  >
                    {spotlightYear} →
                  </Link>
                </div>
                <ul className="mt-2 space-y-2">
                  {meanwhile.slice(0, 4).map((card) => (
                    <li key={`${card.kind}-${card.slug}`}>
                      <Link
                        href={linkWithTrail(
                          card.kind === "work" ? `/works/${card.slug}` : `/events/${card.slug}`,
                        )}
                        className="group flex items-start gap-2 text-[13px] text-fg-soft transition-colors hover:text-fg"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: CATEGORY_COLOR_VAR[card.category] }}
                          aria-hidden
                        />
                        <span className="leading-snug">
                          {(locale === "ja" && card.titleJa) || card.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
