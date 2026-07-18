"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";

export type PlaceViewData = { name: string; nameJa: string | null; placeType: string | null; country: string | null };
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
}: {
  place: PlaceViewData;
  worksHere: EntityLink[];
  eventsHere: EntityLink[];
  residents: Resident[];
}) {
  const { locale } = useLanguage();
  const name = (locale === "ja" && place.nameJa) || place.name;

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        {place.placeType ?? "Place"}
        {place.country && ` · ${place.country}`}
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
                  href={`/people/${r.slug}`}
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
          <EntityList items={worksHere} base="/works" locale={locale} />
        </Section>
      )}

      {eventsHere.length > 0 && (
        <Section title="Events">
          <EntityList items={eventsHere} base="/events" locale={locale} />
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
}: {
  items: EntityLink[];
  base: string;
  locale: "en" | "ja";
}) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`${base}/${item.slug}`}
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
