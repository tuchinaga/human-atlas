"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-provider";
import { MeanwhileThread } from "@/components/MeanwhileThread";

export function SearchHero() {
  const { t } = useLanguage();
  const examples = t.home.searchExamples;
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setExampleIndex((i) => (i + 1) % examples.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [examples.length]);

  return (
    <section className="pt-6 text-center md:pt-10">
      <p className="font-display text-[15vw] leading-none tracking-tight sm:text-[9vw] md:text-[6.5vw] lg:text-[88px]">
        HA
      </p>
      <h1 className="font-display mt-2 text-xl tracking-tight md:text-2xl">
        {t.brand.name}
      </h1>
      <p className="mt-3 text-[14px] text-fg-muted">{t.brand.tagline}</p>

      <MeanwhileThread className="mx-auto mt-10 h-4 w-full max-w-md" />

      <form
        role="search"
        className="mx-auto mt-10 w-full max-w-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-3 rounded-full border border-border bg-bg-raised px-5 py-3.5 transition-colors focus-within:border-fg">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 text-fg-muted">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            aria-label={t.home.searchPlaceholder}
            placeholder={`${t.home.searchPlaceholder}\u2026`}
            className="w-full bg-transparent text-[14px] text-fg placeholder:text-fg-muted focus:outline-none"
          />
        </div>
        <p className="mt-3 text-[12px] text-fg-muted">
          <span key={exampleIndex} className="ha-fade-in">
            {examples[exampleIndex]}
          </span>
        </p>
      </form>

      <style>{`
        .ha-fade-in { animation: ha-fade 0.5s ease; }
        @keyframes ha-fade { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .ha-fade-in { animation: none; }
        }
      `}</style>
    </section>
  );
}
