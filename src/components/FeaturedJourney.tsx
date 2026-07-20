"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { RightsPendingPlaceholder, type ImageAssetData } from "@/components/EntityImage";

export type FeaturedJourneyData = {
  slug: string;
  title: string;
  titleJa: string | null;
  description: string | null;
  descriptionJa: string | null;
  image: ImageAssetData | null;
};

export function FeaturedJourney({ journey }: { journey: FeaturedJourneyData }) {
  const { t, locale } = useLanguage();
  const title = (locale === "ja" && journey.titleJa) || journey.title;
  const description = (locale === "ja" && journey.descriptionJa) || journey.description;

  return (
    <section className="mx-auto mt-16 max-w-4xl">
      <Link
        href={`/journeys/${journey.slug}`}
        className="group grid gap-0 overflow-hidden rounded-sm border border-border sm:grid-cols-[1.1fr_1fr]"
      >
        <div className="relative h-[260px] overflow-hidden bg-bg-raised sm:h-[360px]">
          {journey.image ? (
            <div
              role="img"
              aria-label={title}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${journey.image.imageUrl})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          ) : (
            <RightsPendingPlaceholder />
          )}
        </div>
        <div className="flex flex-col justify-center gap-3 bg-bg-raised p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            {t.home.featuredLabel}
          </p>
          <h2 className="font-display text-2xl leading-tight md:text-[28px]">{title}</h2>
          {description && (
            <p className="text-[13.5px] leading-relaxed text-fg-soft">{description}</p>
          )}
        </div>
      </Link>
    </section>
  );
}

/**
 * Human Atlas never hosts or fabricates imagery whose rights are
 * unverified (see spec §19). Until the ingestion pipeline attaches a
 * cleared Image Asset, entity cards render the shared rights-pending
 * mark instead of a stock photo or generated substitute.
 */
