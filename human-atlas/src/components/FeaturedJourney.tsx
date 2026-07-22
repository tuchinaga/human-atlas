"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { RightsPendingPlaceholder, type ImageAssetData } from "@/components/EntityImage";

export function FeaturedJourney({ image }: { image: ImageAssetData | null }) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto mt-16 max-w-3xl">
      <Link
        href="/journeys/paris-1889"
        className="group grid gap-0 overflow-hidden rounded-sm border border-border sm:grid-cols-[1.1fr_1fr]"
      >
        <div className="relative aspect-[4/3] sm:aspect-auto">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- external, rights-cleared source
            <img
              src={image.imageUrl}
              alt={t.home.featuredTitle}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <RightsPendingPlaceholder />
          )}
        </div>
        <div className="flex flex-col justify-center gap-3 bg-bg-raised p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            {t.home.featuredLabel}
          </p>
          <h2 className="font-display text-2xl leading-tight md:text-[28px]">
            {t.home.featuredTitle}
          </h2>
          <p className="text-[13.5px] leading-relaxed text-fg-soft">
            {t.home.featuredDescription}
          </p>
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
