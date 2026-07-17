"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";

const ITEMS: {
  key: keyof ReturnType<typeof useLanguage>["t"]["mobileNav"];
  href: string;
  icon: (active: boolean) => React.ReactNode;
}[] = [
  {
    key: "explore",
    href: "/explore",
    icon: () => <CompassIcon />,
  },
  {
    key: "timeline",
    href: "/year/1889",
    icon: () => <TimelineIcon />,
  },
  {
    key: "map",
    href: "/explore?view=map",
    icon: () => <MapIcon />,
  },
  {
    key: "search",
    href: "/explore?focus=search",
    icon: () => <SearchIcon />,
  },
  {
    key: "saved",
    href: "/saved",
    icon: () => <SavedIcon />,
  },
];

export function MobileNav() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t.brand.name}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex flex-col items-center gap-1 py-2.5 text-fg-soft transition-colors active:text-accent"
            >
              {item.icon(false)}
              <span className="text-[10px] uppercase tracking-[0.06em]">
                {t.mobileNav[item.key]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.1" />
      <path d="M10.2 5.8L6.6 7.2 5.8 10.2l3.6-1.4z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
function TimelineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="4.5" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="11.5" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5.5 2.5L1.5 4v9.5l4-1.5 5 1.5 4-1.5V2.5l-4 1.5-5-1.5z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <line x1="5.5" y1="2.5" x2="5.5" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="10.5" y1="4" x2="10.5" y2="13.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function SavedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 1.8h9v12.4l-4.5-2.7-4.5 2.7z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
