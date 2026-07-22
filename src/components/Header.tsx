"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { useTheme } from "@/lib/theme-provider";

const NAV_ITEMS: { key: keyof ReturnType<typeof useLanguage>["t"]["nav"]; href: string }[] = [
  { key: "explore", href: "/year/1889" },
  { key: "people", href: "/people" },
  { key: "place", href: "/map" },
  { key: "work", href: "/works" },
];

export function Header() {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={t.brand.name}
        >
          <span className="font-display text-xl font-medium tracking-tight">
            HA
          </span>
          <span className="hidden text-[13px] text-fg-muted sm:inline">
            {t.brand.name}
          </span>
        </Link>

        <nav
          aria-label={t.nav.explore}
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] uppercase tracking-[0.08em] text-fg-soft transition-colors hover:text-fg"
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/explore?focus=search"
            aria-label={t.nav.search}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-fg-soft transition-colors hover:border-fg hover:text-fg md:flex"
          >
            <SearchIcon />
          </Link>

          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ja" : "en")}
            aria-label={t.language.toggle}
            className="h-9 rounded-full border border-border px-3 text-[12px] uppercase tracking-[0.08em] text-fg-soft transition-colors hover:border-fg hover:text-fg"
          >
            {locale === "en" ? "日本語" : "EN"}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t.theme.toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg-soft transition-colors hover:border-fg hover:text-fg"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.5 9.5A6 6 0 016.5 2.5a6 6 0 106.999 7z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 1.2v1.4M8 13.4v1.4M14.8 8h-1.4M2.6 8H1.2M12.6 3.4l-1 1M4.4 11.6l-1 1M12.6 12.6l-1-1M4.4 4.4l-1-1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
