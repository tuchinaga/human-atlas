"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-provider";
import { PageShell } from "@/components/PageShell";
import { Breadcrumb } from "@/components/Breadcrumb";
import { parseTrail, extendTrail, type TrailStep } from "@/lib/trail";

export type MovementViewData = {
  slug: string;
  name: string;
  nameJa: string | null;
  description: string | null;
  descriptionJa: string | null;
};
export type MemberLink = { name: string; nameJa: string | null; slug: string };
export type WorkLink = { slug: string; title: string; titleJa: string | null };

export function MovementView({
  movement,
  members,
  works,
  trail,
}: {
  movement: MovementViewData;
  members: MemberLink[];
  works: WorkLink[];
  trail?: string;
}) {
  const { locale } = useLanguage();
  const name = (locale === "ja" && movement.nameJa) || movement.name;
  const description = (locale === "ja" && movement.descriptionJa) || movement.description;

  const breadcrumbSteps = parseTrail(trail);
  const movementStep: TrailStep = { type: "movement", slug: movement.slug, label: name };
  const trailFromHere = extendTrail(trail, movementStep);
  const linkWithTrail = (href: string) => `${href}?trail=${encodeURIComponent(trailFromHere)}`;

  return (
    <PageShell>
      <Breadcrumb steps={breadcrumbSteps} />
      <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
        Movement
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {name}
      </h1>

      {description && (
        <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-fg-soft">
          {description}
        </p>
      )}

      {members.length > 0 && (
        <section className="mt-12 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            People
          </p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {members.map((m) => (
              <li key={m.slug}>
                <Link
                  href={linkWithTrail(`/people/${m.slug}`)}
                  className="flex items-center justify-between py-3 text-[14px] text-fg-soft transition-colors hover:text-fg"
                >
                  <span>{(locale === "ja" && m.nameJa) || m.name}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {works.length > 0 && (
        <section className="mt-12 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">
            Works
          </p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {works.map((w) => (
              <li key={w.slug}>
                <Link
                  href={linkWithTrail(`/works/${w.slug}`)}
                  className="flex items-center justify-between py-3 text-[14px] text-fg-soft transition-colors hover:text-fg"
                >
                  <span>{(locale === "ja" && w.titleJa) || w.title}</span>
                  <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {members.length === 0 && works.length === 0 && (
        <p className="mt-8 max-w-xl text-[14px] text-fg-muted">
          No linked people or works yet.
        </p>
      )}
    </PageShell>
  );
}
