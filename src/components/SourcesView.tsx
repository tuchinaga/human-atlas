"use client";

import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/lib/language-provider";

const CONFIDENCE_KEYS = [
  "verified",
  "probable",
  "approximate",
  "disputed",
  "unknown",
] as const;

export function SourcesView() {
  const { t } = useLanguage();
  const p = t.sourcesPage;

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl">
        <p className="text-[12px] uppercase tracking-[0.14em] text-fg-muted">
          {p.eyebrow}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-[1.1] md:text-5xl">
          {p.title}
        </h1>
        <p
          className="mt-5 text-[15px] leading-relaxed text-fg-soft [word-break:keep-all] [overflow-wrap:break-word]"
        >
          {p.intro}
        </p>

        {p.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-4 text-[14.5px] leading-relaxed text-fg-soft [word-break:keep-all] [overflow-wrap:break-word]"
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-10 rounded-sm border border-border bg-bg-raised p-5">
          <p className="text-[11px] uppercase tracking-[0.1em] text-fg-muted">
            {p.confidenceTitle}
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-fg-soft [word-break:keep-all] [overflow-wrap:break-word]">
            {p.confidenceIntro}
          </p>
          <ul className="mt-4 space-y-2 text-[13.5px] leading-relaxed text-fg-soft">
            {CONFIDENCE_KEYS.map((key) => (
              <li key={key} className="flex gap-2">
                <span aria-hidden className="text-fg-muted">
                  —
                </span>
                <span>{t.common[key]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
