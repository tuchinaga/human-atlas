"use client";

import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/lib/language-provider";

export function RightsView() {
  const { t } = useLanguage();
  const p = t.rightsPage;

  return (
    <PageShell>
      <p className="text-[12px] uppercase tracking-[0.14em] text-fg-muted">
        {p.eyebrow}
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {p.title}
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-fg-soft">
        {p.intro}
      </p>

      {p.paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-fg-soft"
        >
          {paragraph}
        </p>
      ))}
    </PageShell>
  );
}
