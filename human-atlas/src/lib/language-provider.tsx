"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";

export type Locale = "en" | "ja";

const dictionaries: Record<Locale, typeof en> = { en, ja };

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof en;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "human-atlas-locale";

const listeners = new Set<() => void>();
let cachedSnapshot: Locale | null = null;

function readLocale(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "ja") return stored;
  return window.navigator.language.toLowerCase().startsWith("ja")
    ? "ja"
    : "en";
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot(): Locale {
  if (cachedSnapshot === null) cachedSnapshot = readLocale();
  return cachedSnapshot;
}

function getServerSnapshot(): Locale {
  return "en";
}

function writeLocale(next: Locale) {
  cachedSnapshot = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((l) => l());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale: writeLocale, t: dictionaries[locale] }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/**
 * Given a set of localized name fields (the shape every Person, Work and
 * Place entity uses — see section 21 of the product spec), resolve the
 * best available display name for the current locale, falling back to
 * English and then the original-language name.
 */
export function resolveLocalizedName(
  locale: Locale,
  names: { name?: string | null; nameJa?: string | null; nativeName?: string | null },
) {
  if (locale === "ja") return names.nameJa || names.name || names.nativeName || "";
  return names.name || names.nativeName || names.nameJa || "";
}
