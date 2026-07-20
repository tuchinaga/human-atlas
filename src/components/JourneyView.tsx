"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";

const TYPE_LABEL: Record<string, { en: string; ja: string }> = {
  year: { en: "Year", ja: "年" },
  person: { en: "Person", ja: "人物" },
  work: { en: "Work", ja: "作品" },
  place: { en: "Place", ja: "場所" },
  event: { en: "Event", ja: "出来事" },
  movement: { en: "Movement", ja: "ムーブメント" },
};

export type JourneyStepView = {
  type: string;
  slug: string;
  href: string;
  title: string;
  titleJa: string | null;
  caption: string | null;
  captionJa: string | null;
};

export function JourneyView({
  title,
  titleJa,
  description,
  descriptionJa,
  steps,
}: {
  title: string;
  titleJa: string | null;
  description: string | null;
  descriptionJa: string | null;
  steps: JourneyStepView[];
}) {
  const { locale } = useLanguage();

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        {locale === "ja" ? "ジャーニー" : "Journey"}
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {(locale === "ja" && titleJa) || title}
      </h1>
      {(description || descriptionJa) && (
        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-fg-soft">
          {(locale === "ja" && descriptionJa) || description}
        </p>
      )}

      <ol className="mt-12 max-w-xl space-y-10 border-l border-border pl-6">
        {steps.map((step, i) => (
          <li key={`${step.type}-${step.slug}`} className="relative">
            <span
              className="tabular absolute -left-[31px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-bg text-[11px] text-fg-muted"
              aria-hidden
            >
              {i + 1}
            </span>
            <p className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">
              {TYPE_LABEL[step.type]?.[locale] ?? step.type}
            </p>
            <Link
              href={step.href}
              className="font-display mt-1 block text-2xl leading-snug text-fg transition-colors hover:text-accent"
            >
              {(locale === "ja" && step.titleJa) || step.title}
            </Link>
            {(step.caption || step.captionJa) && (
              <p className="mt-2 text-[14px] leading-relaxed text-fg-soft">
                {(locale === "ja" && step.captionJa) || step.caption}
              </p>
            )}
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
