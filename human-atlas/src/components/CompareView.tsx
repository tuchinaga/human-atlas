"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { EntityImage, type ImageAssetData } from "@/components/EntityImage";

export type ComparePerson = {
  slug: string;
  name: string;
  nameJa: string | null;
  birthDate: string | null;
  deathDate: string | null;
  occupations: string[];
  works: { slug: string; title: string; titleJa: string | null; creationStartDate: string | null }[];
  movements: { slug: string; name: string; nameJa: string | null }[];
  journey: { placeName: string; placeNameJa: string | null }[];
  image: ImageAssetData | null;
};

function yearOf(date: string | null): number | null {
  return date ? Number(date.slice(0, 4)) : null;
}

export function CompareView({ a, b }: { a: ComparePerson; b: ComparePerson }) {
  const { locale } = useLanguage();
  const people = [a, b];

  return (
    <PageShell>
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">Compare</p>
      <h1 className="font-display mt-3 text-3xl leading-[1.15] md:text-4xl">
        {(locale === "ja" && a.nameJa) || a.name}
        <span className="mx-3 text-fg-muted">×</span>
        {(locale === "ja" && b.nameJa) || b.name}
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10">
        {/* Portraits + names */}
        {people.map((p) => (
          <div key={p.slug}>
            <EntityImage
              image={p.image}
              alt={(locale === "ja" && p.nameJa) || p.name}
              aspect="aspect-square"
              className="max-w-[180px]"
            />
            <Link
              href={`/people/${p.slug}`}
              className="mt-3 block text-[16px] text-fg transition-colors hover:text-accent"
            >
              {(locale === "ja" && p.nameJa) || p.name}
            </Link>
          </div>
        ))}

        <CompareRow label={locale === "ja" ? "生没年" : "Lifespan"}>
          {people.map((p) => {
            const birth = yearOf(p.birthDate);
            const death = yearOf(p.deathDate);
            return (
              <span key={p.slug} className="tabular">
                {birth ?? "?"} – {death ?? (locale === "ja" ? "現在" : "present")}
                {birth && death && (
                  <span className="ml-1.5 text-fg-muted">({death - birth})</span>
                )}
              </span>
            );
          })}
        </CompareRow>

        <CompareRow label={locale === "ja" ? "分野" : "Discipline"}>
          {people.map((p) => (
            <span key={p.slug}>{p.occupations.join(" · ") || "—"}</span>
          ))}
        </CompareRow>

        <CompareRow label={locale === "ja" ? "ムーブメント" : "Movement"}>
          {people.map((p) => (
            <span key={p.slug} className="flex flex-wrap gap-x-2 gap-y-1">
              {p.movements.length === 0
                ? "—"
                : p.movements.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/movements/${m.slug}`}
                      className="underline underline-offset-2 hover:text-fg"
                    >
                      {(locale === "ja" && m.nameJa) || m.name}
                    </Link>
                  ))}
            </span>
          ))}
        </CompareRow>

        <CompareRow label={locale === "ja" ? "地理的な広がり" : "Geography"}>
          {people.map((p) => {
            const names = [
              ...new Set(p.journey.map((j) => (locale === "ja" && j.placeNameJa) || j.placeName)),
            ];
            return <span key={p.slug}>{names.length > 0 ? names.join(" → ") : "—"}</span>;
          })}
        </CompareRow>

        <CompareRow label={locale === "ja" ? "代表作" : "Major works"} align="top">
          {people.map((p) => (
            <ul key={p.slug} className="space-y-1">
              {p.works.length === 0 ? (
                <li className="text-fg-muted">—</li>
              ) : (
                p.works.map((w) => (
                  <li key={w.slug}>
                    <Link
                      href={`/works/${w.slug}`}
                      className="text-fg-soft underline underline-offset-2 transition-colors hover:text-fg"
                    >
                      {(locale === "ja" && w.titleJa) || w.title}
                    </Link>
                    {w.creationStartDate && (
                      <span className="tabular ml-1.5 text-fg-muted">
                        {yearOf(w.creationStartDate)}
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          ))}
        </CompareRow>
      </div>
    </PageShell>
  );
}

function CompareRow({
  label,
  align = "center",
  children,
}: {
  label: string;
  align?: "center" | "top";
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="col-span-2">
        <p className="text-[10.5px] uppercase tracking-[0.08em] text-fg-muted">{label}</p>
      </div>
      <div className={`col-span-2 grid grid-cols-2 gap-x-6 border-t border-border pt-3 text-[13.5px] text-fg-soft sm:gap-x-10 ${align === "top" ? "items-start" : ""}`}>
        {children}
      </div>
    </>
  );
}
