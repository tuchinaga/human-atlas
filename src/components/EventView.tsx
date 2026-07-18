"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { CATEGORY_COLOR_VAR } from "@/lib/categories";
import { YearCard } from "@/components/YearCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { parseTrail, extendTrail, type TrailStep } from "@/lib/trail";
import type { Category } from "@/db/schema";
import type { YearCategoryCard } from "@/db/queries";

export type EventViewData = {
  slug: string;
  title: string;
  titleJa: string | null;
  category: Category;
  displayDate: string | null;
  description: string | null;
  descriptionJa: string | null;
  confidence: string;
};

export type EventPlace = { name: string; nameJa: string | null; slug: string } | null;

export function EventView({
  event,
  place,
  relatedWorks,
  meanwhile,
  year,
  trail,
}: {
  event: EventViewData;
  place: EventPlace;
  relatedWorks: { slug: string; title: string; titleJa: string | null }[];
  meanwhile: YearCategoryCard[];
  year: number | null;
  trail?: string;
}) {
  const { locale, t } = useLanguage();
  const title = (locale === "ja" && event.titleJa) || event.title;
  const description = (locale === "ja" && event.descriptionJa) || event.description;
  const confidenceLabel =
    event.confidence in t.common
      ? t.common[event.confidence as keyof typeof t.common]
      : event.confidence;

  const breadcrumbSteps = parseTrail(trail);
  const eventStep: TrailStep = { type: "event", slug: event.slug, label: title };
  const trailFromHere = extendTrail(trail, eventStep);
  const linkWithTrail = (href: string) => `${href}?trail=${encodeURIComponent(trailFromHere)}`;

  return (
    <PageShell>
      <Breadcrumb steps={breadcrumbSteps} />
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: CATEGORY_COLOR_VAR[event.category] }}
          aria-hidden
        />
        <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
          {t.categories[event.category]}
        </p>
      </div>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-fg-soft">
        {event.displayDate && <span className="tabular">{event.displayDate}</span>}
        {place && (
          <Link href={linkWithTrail(`/places/${place.slug}`)} className="transition-colors hover:text-fg">
            {(locale === "ja" && place.nameJa) || place.name}
          </Link>
        )}
      </div>

      {description && (
        <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-fg-soft">
          {description}
        </p>
      )}

      <p className="mt-6">
        <ConfidenceBadge confidence={event.confidence} label={confidenceLabel} />
      </p>

      {relatedWorks.length > 0 && (
        <section className="mt-12 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            {locale === "ja" ? "関連作品" : "Related works"}
          </p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {relatedWorks.map((w) => (
              <li key={w.slug}>
                <Link
                  href={linkWithTrail(`/works/${w.slug}`)}
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

      {meanwhile.length > 0 && year && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
              {t.meanwhile.label}
            </p>
            <Link
              href={linkWithTrail(`/year/${year}`)}
              className="text-[12px] text-fg-muted transition-colors hover:text-fg"
            >
              {year} →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {meanwhile.map((card) => (
              <YearCard
                key={`${card.kind}-${card.slug}`}
                card={card}
                currentTrail={trail}
                fromStep={eventStep}
              />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
