"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { Breadcrumb } from "@/components/Breadcrumb";
import { parseTrail, extendTrail, type TrailStep } from "@/lib/trail";
import { localizePlaceType, localizeCountry } from "@/lib/localize";

export type PlaceViewData = {
  slug: string;
  name: string;
  nameJa: string | null;
  placeType: string | null;
  country: string | null;
};
export type EntityLink = { slug: string; title: string; titleJa: string | null };
export type Resident = {
  name: string;
  nameJa: string | null;
  slug: string;
  startDate: string | null;
  endDate: string | null;
};

export function PlaceView({
  place,
  worksHere,
  eventsHere,
  residents,
  trail,
}: {
  place: PlaceViewData;
  worksHere: EntityLink[];
  eventsHere: EntityLink[];
  residents: Resident[];
  trail?: string;
}) {
  const { locale } = useLanguage();
  const name = (locale === "ja" && place.nameJa) || place.name;

  const breadcrumbSteps = parseTrail(trail);
  const placeStep: TrailStep = { type: "place", slug: place.slug, label: name };
  const trailFromHere = extendTrail(trail, placeStep);
  const linkWithTrail = (href: string) => `${href}?trail=${encodeURIComponent(trailFromHere)}`;

  return (
    <PageShell>
      <Breadcrumb steps={breadcrumbSteps} />
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        {localizePlaceType(place.placeType, locale) ?? "Place"}
        {place.country && ` · ${localizeCountry(place.country, locale)}`}
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {name}
      </h1>

      {residents.length > 0 && (
        <Section title="People who lived or worked here">
          <ul className="divide-y divide-border border-y border-border">
            {residents.map((r) => (
              <li key={r.slug}>
                <Link
                  href={linkWithTrail(`/people/${r.slug}`)}
                  className="flex items-center justify-between py-3 text-[14px] text-fg-soft transition-colors hover:text-fg"
                >
                  <span>{(locale === "ja" && r.nameJa) || r.name}</span>
                  <span className="tabular text-[12px] text-fg-muted">
                    {r.startDate?.slice(0, 4)}
                    {r.endDate ? `–${r.endDate.slice(0, 4)}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {worksHere.length > 0 && (
        <Section title="Works created here">
          <EntityList items={worksHere} base="/works" locale={locale} linkWithTrail={linkWithTrail} />
        </Section>
      )}

      {eventsHere.length > 0 && (
        <Section title="Events">
          <EntityList items={eventsHere} base="/events" locale={locale} linkWithTrail={linkWithTrail} />
        </Section>
      )}

      {residents.length === 0 && worksHere.length === 0 && eventsHere.length === 0 && (
        <p className="mt-8 max-w-xl text-[14px] text-fg-muted">
          No linked people, works or events yet.
        </p>
      )}
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 max-w-xl">
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EntityList({
  items,
  base,
  locale,
  linkWithTrail,
}: {
  items: EntityLink[];
  base: string;
  locale: "en" | "ja";
  linkWithTrail: (href: string) => string;
}) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={linkWithTrail(`${base}/${item.slug}`)}
            className="flex items-center justify-between py-3 text-[14px] text-fg-soft transition-colors hover:text-fg"
          >
            <span>{(locale === "ja" && item.titleJa) || item.title}</span>
            <span aria-hidden>→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
