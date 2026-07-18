"use client";

import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { WorldMap, type MapPoint } from "@/components/WorldMap";

export type MapPlace = {
  slug: string;
  name: string;
  nameJa: string | null;
  latitude: number;
  longitude: number;
};

export function MapExplorer({ places }: { places: MapPlace[] }) {
  const { locale } = useLanguage();

  const points: MapPoint[] = places.map((p) => ({
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

      <div className="mt-8">
        <WorldMap points={points} height="560px" initialZoom={2} />
      </div>
    </PageShell>
  );
}
