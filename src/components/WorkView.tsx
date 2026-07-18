"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { CATEGORY_COLOR_VAR } from "@/lib/categories";
import type { Category } from "@/db/schema";

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
}: {
  work: WorkViewData;
  creator: string | null;
  creationPlace: { name: string; nameJa: string | null } | null;
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
    </PageShell>
  );
}
