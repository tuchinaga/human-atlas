"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";

const ENTRY_POINTS: {
  key: keyof ReturnType<typeof useLanguage>["t"]["home"]["entryPoints"];
  href: string;
}[] = [
  { key: "year", href: "/year/1889" },
  { key: "person", href: "/people" },
  { key: "place", href: "/map" },
  { key: "work", href: "/works" },
];

export function EntryPoints() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t.home.searchPlaceholder}
      className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4"
    >
      {ENTRY_POINTS.map((entry) => (
        <Link
          key={entry.href}
          href={entry.href}
          className="group flex items-center justify-center bg-bg px-3 py-5 text-center text-[12.5px] leading-snug text-fg-soft transition-colors hover:bg-bg-raised hover:text-fg"
        >
          {t.home.entryPoints[entry.key]}
        </Link>
      ))}
    </nav>
  );
}
