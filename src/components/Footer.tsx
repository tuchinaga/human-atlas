"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";

export type FooterStats = {
  peopleCount: number;
  worksCount: number;
  eventsCount: number;
  placesCount: number;
};

export function Footer({
  stats,
  version,
  dataAsOf,
}: {
  stats: FooterStats;
  version: string;
  dataAsOf: string;
}) {
  const { t } = useLanguage();

  const dataSnapshot = t.footer.dataSnapshot
    .replace("{people}", String(stats.peopleCount))
    .replace("{works}", String(stats.worksCount))
    .replace("{events}", String(stats.eventsCount))
    .replace("{places}", String(stats.placesCount));

  return (
    <footer className="border-t border-border pb-16 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-[12px] text-fg-muted md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-sm font-medium tracking-tight text-fg-soft">
              HA
            </span>
            <span>{t.footer.tagline}</span>
          </div>
          <p className="tabular">{dataSnapshot}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/about" className="transition-colors hover:text-fg">
            {t.nav.about}
          </Link>
          <Link href="/sources" className="transition-colors hover:text-fg">
            {t.common.sources}
          </Link>
          <Link href="/rights" className="transition-colors hover:text-fg">
            {t.common.rights}
          </Link>
          <span className="tabular">
            {t.footer.version} {version}
          </span>
          <span className="tabular">
            {t.footer.dataAsOf} {dataAsOf}
          </span>
        </div>
      </div>
    </footer>
  );
}
