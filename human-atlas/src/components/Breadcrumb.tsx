import Link from "next/link";
import { TRAIL_TYPE_PATH, truncateTrail, type TrailStep } from "@/lib/trail";

export function Breadcrumb({ steps }: { steps: TrailStep[] }) {
  if (steps.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px]">
      {steps.map((step, i) => {
        const href =
          step.type === "year"
            ? `/year/${step.slug}`
            : `/${TRAIL_TYPE_PATH[step.type]}/${step.slug}`;
        const trailParam = truncateTrail(steps, i);
        return (
          <span key={`${step.type}-${step.slug}-${i}`} className="flex items-center gap-x-1.5">
            <Link
              href={trailParam ? `${href}?trail=${encodeURIComponent(trailParam)}` : href}
              className="text-fg-muted transition-colors hover:text-fg"
            >
              {step.label}
            </Link>
            <span className="text-fg-muted" aria-hidden>
              →
            </span>
          </span>
        );
      })}
    </nav>
  );
}
