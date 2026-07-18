"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { CATEGORY_COLOR_VAR } from "@/lib/categories";
import { YearCard } from "@/components/YearCard";
import { EntityImage, type ImageAssetData } from "@/components/EntityImage";
import type { Category } from "@/db/schema";
import type { YearCategoryCard } from "@/db/queries";

export type WorkViewData = {
  title: string;
  titleJa: string | null;
  workType: string;
  category: Category;
  displayDate: string | null;
  medium: string | null;
  description: string | null;
  descriptionJa: string | null;
  confidence: string;
};

export function WorkView({
  work,
  creator,
  creationPlace,
  meanwhile,
  year,
  image,
}: {
  work: WorkViewData;
  creator: string | null;
  creationPlace: { name: string; nameJa: string | null } | null;
  meanwhile: YearCategoryCard[];
  year: number | null;
  image: ImageAssetData | null;
}) {
  const { locale, t } = useLanguage();
  const title = (locale === "ja" && work.titleJa) || work.title;
  const description = (locale === "ja" && work.descriptionJa) || work.description;
  const confidenceLabel =
    work.confidence in t.common
      ? t.common[work.confidence as keyof typeof t.common]
      : work.confidence;

  return (
    <PageShell>
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
        {creator && <span>{creator}</span>}
        {work.displayDate && <span className="tabular">{work.displayDate}</span>}
        {creationPlace && (
          <span>{(locale === "ja" && creationPlace.nameJa) || creationPlace.name}</span>
        )}
        {work.medium && <span className="text-fg-muted">{work.medium}</span>}
      </div>

      <EntityImage image={image} className="mt-8 max-w-xl" />

      {description && (
        <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-fg-soft">
          {description}
        </p>
      )}

      <p className="mt-6 text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
        {confidenceLabel}
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
              href={`/year/${year}`}
              className="text-[12px] text-fg-muted transition-colors hover:text-fg"
            >
              {year} →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {meanwhile.map((card) => (
              <YearCard key={`${card.kind}-${card.slug}`} card={card} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
