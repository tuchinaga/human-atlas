"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { EntityImage } from "@/components/EntityImage";
import type { WorkIndexEntry } from "@/db/queries";

function yearOf(date: string | null): number | null {
  if (!date) return null;
  const y = new Date(date).getUTCFullYear();
  return Number.isNaN(y) ? null : y;
}

export function WorksIndexView({ works }: { works: WorkIndexEntry[] }) {
  const { locale, t } = useLanguage();

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        {locale === "ja" ? "作品" : "Works"}
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {locale === "ja" ? "作品を発見する" : "Discover a Work"}
      </h1>
      <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-fg-soft">
        {locale === "ja"
          ? `制作年順に並んだ${works.length}点。`
          : `${works.length} works, sorted by creation year.`}
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {works.map((w) => {
          const title = (locale === "ja" && w.titleJa) || w.title;
          const year = yearOf(w.creationStartDate);
          return (
            <Link key={w.slug} href={`/works/${w.slug}`} className="group block">
              {w.image || w.workType !== "musical composition" ? (
                <EntityImage image={w.image} alt={title} aspect="aspect-square" />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-sm border border-border bg-bg-raised">
                  <span className="font-display text-3xl text-fg-muted" aria-hidden>
                    ♪
                  </span>
                </div>
              )}
              <p className="mt-2 text-[13px] text-fg-soft transition-colors group-hover:text-fg">
                {title}
              </p>
              <p className="tabular text-[11px] text-fg-muted">
                {t.categories[w.category]}
                {year && ` · ${year}`}
              </p>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
