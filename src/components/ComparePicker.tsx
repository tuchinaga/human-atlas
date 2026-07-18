"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";

export type PersonOption = { slug: string; name: string; nameJa: string | null };

export function ComparePicker({ people }: { people: PersonOption[] }) {
  const { locale } = useLanguage();
  const router = useRouter();
  const [a, setA] = useState(people[0]?.slug ?? "");
  const [b, setB] = useState(people[1]?.slug ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!a || !b || a === b) return;
    router.push(`/compare?a=${a}&b=${b}`);
  }

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        {locale === "ja" ? "比較" : "Compare"}
      </p>
      <h1 className="font-display mt-3 max-w-xl text-4xl leading-[1.1] md:text-5xl">
        {locale === "ja" ? "2人を選んで比較する" : "Choose two people to compare"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="text-[11px] uppercase tracking-[0.08em] text-fg-muted">A</span>
          <select
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-border bg-bg-raised px-3 py-2.5 text-[14px] text-fg focus:border-fg focus:outline-none"
          >
            {people.map((p) => (
              <option key={p.slug} value={p.slug}>
                {(locale === "ja" && p.nameJa) || p.name}
              </option>
            ))}
          </select>
        </label>

        <span className="pb-2.5 text-fg-muted" aria-hidden>
          ×
        </span>

        <label className="flex-1">
          <span className="text-[11px] uppercase tracking-[0.08em] text-fg-muted">B</span>
          <select
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-border bg-bg-raised px-3 py-2.5 text-[14px] text-fg focus:border-fg focus:outline-none"
          >
            {people.map((p) => (
              <option key={p.slug} value={p.slug}>
                {(locale === "ja" && p.nameJa) || p.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={!a || !b || a === b}
          className="h-[42px] rounded-sm border border-fg bg-fg px-5 text-[13px] text-bg transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {locale === "ja" ? "比較する" : "Compare"}
        </button>
      </form>
    </PageShell>
  );
}
