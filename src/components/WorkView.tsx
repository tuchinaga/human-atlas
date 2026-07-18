"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { CATEGORY_COLOR_VAR } from "@/lib/categories";
import { YearCard } from "@/components/YearCard";
import { EntityImage, type ImageAssetData } from "@/components/EntityImage";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { parseTrail, extendTrail, type TrailStep } from "@/lib/trail";
import type { Category } from "@/db/schema";
import type { YearCategoryCard } from "@/db/queries";

export type WorkViewData = {
  slug: string;
  title: string;
  titleJa: string | null;
  workType: string;
  category: Category;
  displayDate: string | null;
  medium: string | null;
  dimensions: string | null;
  currentInstitution: string | null;
  description: string | null;
  descriptionJa: string | null;
  confidence: string;
};

export type MovementLink = { slug: string; name: string; nameJa: string | null };
export type CreatorLink = { name: string; nameJa: string | null; slug: string };
export type PlaceLink = { name: string; nameJa: string | null; slug: string };

export function WorkView({
  work,
  creator,
  creationPlace,
  meanwhile,
  year,
  image,
  movement,
  trail,
}: {
  work: WorkViewData;
  creator: CreatorLink | null;
  creationPlace: PlaceLink | null;
  meanwhile: YearCategoryCard[];
  year: number | null;
  image: ImageAssetData | null;
  movement: MovementLink | null;
  trail?: string;
}) {
  const { locale, t } = useLanguage();
  const title = (locale === "ja" && work.titleJa) || work.title;
  const description = (locale === "ja" && work.descriptionJa) || work.description;
  const confidenceLabel =
    work.confidence in t.common
      ? t.common[work.confidence as keyof typeof t.common]
      : work.confidence;

  const breadcrumbSteps = parseTrail(trail);
  const workStep: TrailStep = { type: "work", slug: work.slug, label: title };
  const trailFromHere = extendTrail(trail, workStep);
  const linkWithTrail = (href: string) => `${href}?trail=${encodeURIComponent(trailFromHere)}`;

  const metaRows: { label: string; value: React.ReactNode }[] = [];
  if (creationPlace) {
    metaRows.push({
      label: locale === "ja" ? "制作地" : "Creation place",
      value: (
        <Link
          href={linkWithTrail(`/places/${creationPlace.slug}`)}
          className="underline underline-offset-2 transition-colors hover:text-fg"
        >
          {(locale === "ja" && creationPlace.nameJa) || creationPlace.name}
        </Link>
      ),
    });
  }
  if (work.currentInstitution) {
    metaRows.push({
      label: locale === "ja" ? "所蔵" : "Current location",
      value: work.currentInstitution,
    });
  }
  if (work.medium) {
    metaRows.push({ label: locale === "ja" ? "技法・素材" : "Medium", value: work.medium });
  }
  if (work.dimensions) {
    metaRows.push({
      label: locale === "ja" ? "寸法" : "Dimensions",
      value: <span className="tabular">{work.dimensions}</span>,
    });
  }
  if (movement) {
    metaRows.push({
      label: locale === "ja" ? "ムーブメント" : "Movement",
      value: (
        <Link
          href={linkWithTrail(`/movements/${movement.slug}`)}
          className="underline underline-offset-2 transition-colors hover:text-fg"
        >
          {(locale === "ja" && movement.nameJa) || movement.name}
        </Link>
      ),
    });
  }

  return (
    <PageShell>
      <Breadcrumb steps={breadcrumbSteps} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: CATEGORY_COLOR_VAR[work.category] }}
              aria-hidden
            />
            <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
              {t.categories[work.category]} · {work.workType}
            </p>
          </div>
          <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-fg-soft">
            {creator && (
              <Link
                href={linkWithTrail(`/people/${creator.slug}`)}
                className="transition-colors hover:text-fg"
              >
                {(locale === "ja" && creator.nameJa) || creator.name}
              </Link>
            )}
            {work.displayDate && <span className="tabular">{work.displayDate}</span>}
          </div>

          <EntityImage
            image={image}
            alt={title}
            zoomable
            hero
            className="mt-8 max-w-2xl"
          />

          {description && (
            <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-fg-soft">
              {description}
            </p>
          )}

          <p className="mt-6">
            <ConfidenceBadge confidence={work.confidence} label={confidenceLabel} />
          </p>

          <Link
            href="/rights"
            className="mt-8 inline-block text-[12px] text-fg-muted underline underline-offset-2 transition-colors hover:text-fg"
          >
            {t.common.rights}
          </Link>

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
                    fromStep={workStep}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {metaRows.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <dl className="space-y-4 border-t border-border pt-6 text-[13px] lg:border-t-0 lg:pt-0">
              {metaRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 text-fg-soft">{row.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </div>
    </PageShell>
  );
}
