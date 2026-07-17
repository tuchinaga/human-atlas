"use client";

import { useLanguage, resolveLocalizedName } from "@/lib/language-provider";
import { CATEGORY_COLOR_VAR } from "@/lib/categories";
import type { YearCard as YearCardData } from "@/lib/seed-1889";

export function YearCard({ card }: { card: YearCardData }) {
  const { t, locale } = useLanguage();
  const title = locale === "ja" ? card.titleJa : card.title;
  const place = locale === "ja" ? card.placeJa : card.place;
  const context = locale === "ja" ? card.contextJa : card.context;

  return (
    <article className="group border border-border bg-bg p-4 transition-colors hover:bg-bg-raised">
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: CATEGORY_COLOR_VAR[card.category] }}
          aria-hidden
        />
        <p className="text-[11px] uppercase tracking-[0.1em] text-fg-muted">
          {t.categories[card.category]}
        </p>
      </div>
      <h3 className="font-display mt-2.5 text-[19px] leading-snug">{title}</h3>
      {card.person && (
        <p className="mt-1 text-[13px] text-fg-soft">{card.person}</p>
      )}
      <p className="tabular mt-2 text-[12px] text-fg-muted">{place}</p>
      <p className="mt-2.5 text-[13px] leading-relaxed text-fg-soft">
        {context}
      </p>
      <p className="mt-3 text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
        {t.common[card.confidence]}
      </p>
    </article>
  );
}

export function resolveEntityName(
  locale: "en" | "ja",
  entity: { name: string; nameJa?: string },
) {
  return resolveLocalizedName(locale, entity);
}
