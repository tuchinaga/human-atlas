"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { WorldMap, type MapPoint } from "@/components/WorldMap";

export type MapPlace = {
  slug: string;
  name: string;
  nameJa: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
};

export function MapExplorer({ places }: { places: MapPlace[] }) {
  const { locale, t } = useLanguage();
  const [country, setCountry] = useState<string>("all");

  const countries = useMemo(() => {
    const set = new Set(places.map((p) => p.country).filter((c): c is string => !!c));
    return [...set].sort();
  }, [places]);

  const filtered =
    country === "all" ? places : places.filter((p) => p.country === country);

  const points: MapPoint[] = filtered.map((p) => ({
    lat: p.latitude,
    lng: p.longitude,
    label: (locale === "ja" && p.nameJa) || p.name,
    href: `/places/${p.slug}`,
  }));

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        Map
      </p>
      <h1 className="font-display mt-3 text-4xl leading-[1.1] md:text-5xl">
        {locale === "ja" ? "地図" : "Map"}
      </h1>
      <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-fg-soft">
        {locale === "ja"
          ? "登録されているすべての場所です。クリックすると各都市のページに移動します。"
          : "Every place currently in the atlas. Click a marker to open that place."}
      </p>

      {countries.length > 1 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.08em] text-fg-muted">
            {t.regions.label}
          </span>
          <button
            type="button"
            onClick={() => setCountry("all")}
            className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${
              country === "all"
                ? "border-fg text-fg"
                : "border-border text-fg-soft hover:border-fg-soft"
            }`}
          >
            {t.regions.all}
          </button>
          {countries.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCountry(c)}
              className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${
                country === c
                  ? "border-fg text-fg"
                  : "border-border text-fg-soft hover:border-fg-soft"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <WorldMap points={points} height="560px" initialZoom={2} />
      </div>
    </PageShell>
  );
}
