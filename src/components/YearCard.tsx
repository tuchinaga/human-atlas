"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { CATEGORY_COLOR_VAR } from "@/lib/categories";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { extendTrail, type TrailStep } from "@/lib/trail";
import type { YearCategoryCard } from "@/db/queries";

export function YearCard({
  card,
  currentTrail,
  fromStep,
}: {
  card: YearCategoryCard;
  currentTrail?: string;
  fromStep?: TrailStep;
}) {
  const { t, locale } = useLanguage();
  const title = (locale === "ja" && card.titleJa) || card.title;
  const place = (locale === "ja" && card.placeNameJa) || card.placeName;
  const context = (locale === "ja" && card.contextJa) || card.context;
  const basePath = card.kind === "work" ? `/works/${card.slug}` : `/events/${card.slug}`;
  const trail = fromStep ? extendTrail(currentTrail, fromStep) : currentTrail;
  const href = trail ? `${basePath}?trail=${encodeURIComponent(trail)}` : basePath;
  const confidenceLabel =
    card.confidence in t.common
      ? t.common[card.confidence as keyof typeof t.common]
      : card.confidence;

  return (
    <Link
      href={href}
      className="group block border border-border bg-bg p-4 transition-colors hover:bg-bg-raised"
    >
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
      {card.personName && (
        <p className="mt-1 text-[13px] text-fg-soft">{card.personName}</p>
      )}
      {place && <p className="tabular mt-2 text-[12px] text-fg-muted">{place}</p>}
      {context && (
        <p className="mt-2.5 text-[13px] leading-relaxed text-fg-soft">
          {context}
        </p>
      )}
      <p className="mt-3">
        <ConfidenceBadge confidence={card.confidence} label={confidenceLabel} />
      </p>
    </Link>
  );
}
