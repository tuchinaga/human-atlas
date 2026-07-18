"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "@/lib/theme-provider";

export type MapPoint = {
  lat: number;
  lng: number;
  label: string;
  href: string;
  order?: number; // when present with `path`, points connect in this order
};

/**
 * Thin wrapper around MapLibre GL. Renders markers for every point;
 * when `path` is true, also draws a line connecting them in `order` —
 * used for a person's geographic journey (spec §13).
 */
export function WorldMap({
  points,
  path = false,
  height = "480px",
  initialZoom = 3,
}: {
  points: MapPoint[];
  path?: boolean;
  height?: string;
  initialZoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    const tileStyle = theme === "dark" ? "dark_all" : "light_all";
    const centerLng =
      points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    const centerLat =
      points.reduce((sum, p) => sum + p.lat, 0) / points.length;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: "raster",
            tiles: [
              `https://a.basemaps.cartocdn.com/${tileStyle}/{z}/{x}/{y}{r}.png`,
              `https://b.basemaps.cartocdn.com/${tileStyle}/{z}/{x}/{y}{r}.png`,
              `https://c.basemaps.cartocdn.com/${tileStyle}/{z}/{x}/{y}{r}.png`,
            ],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          },
        },
        layers: [{ id: "basemap", type: "raster", source: "basemap" }],
      },
      center: [centerLng, centerLat],
      zoom: initialZoom,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      if (path && points.length > 1) {
        const ordered = [...points].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        map.addSource("journey-path", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: ordered.map((p) => [p.lng, p.lat]),
            },
          },
        });
        map.addLayer({
          id: "journey-path-line",
          type: "line",
          source: "journey-path",
          paint: {
            "line-color": "#d9481e",
            "line-width": 1.5,
            "line-dasharray": [2, 1.5],
          },
        });
      }
    });

    const markers: maplibregl.Marker[] = [];
    points.forEach((point) => {
      const el = document.createElement("button");
      el.setAttribute("aria-label", point.label);
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "50%";
      el.style.background = "#d9481e";
      el.style.border = "2px solid var(--color-bg, #faf6ef)";
      el.style.cursor = "pointer";
      el.style.padding = "0";

      const popup = new maplibregl.Popup({
        offset: 14,
        closeButton: false,
        closeOnClick: false,
      }).setText(point.label);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      el.addEventListener("mouseenter", () => {
        popup.setLngLat([point.lng, point.lat]).addTo(map);
      });
      el.addEventListener("mouseleave", () => {
        popup.remove();
      });
      el.addEventListener("focus", () => {
        popup.setLngLat([point.lng, point.lat]).addTo(map);
      });
      el.addEventListener("blur", () => {
        popup.remove();
      });
      el.addEventListener("click", () => router.push(point.href));
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- points/router intentionally excluded to avoid tearing the map down on every render; theme changes rebuild it deliberately
  }, [theme]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full overflow-hidden rounded-sm border border-border"
    />
  );
}
