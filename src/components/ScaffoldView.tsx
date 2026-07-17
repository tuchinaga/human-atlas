import { PageShell } from "@/components/PageShell";
import { MeanwhileThread } from "@/components/MeanwhileThread";

export function ScaffoldView({
  eyebrow,
  title,
  description,
  route,
  notes,
}: {
  eyebrow: string;
  title: string;
  description: string;
  route: string;
  notes: string[];
}) {
  return (
    <PageShell>
      <p className="text-[12px] uppercase tracking-[0.14em] text-fg-muted">
        {eyebrow}
      </p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.1] md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-soft">
        {description}
      </p>

      <MeanwhileThread animated={false} className="mt-10 h-3 w-full max-w-xl opacity-60" />

      <div className="mt-10 max-w-xl rounded-sm border border-border bg-bg-raised p-5">
        <p className="tabular text-[11px] uppercase tracking-[0.1em] text-fg-muted">
          {route}
        </p>
        <ul className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-fg-soft">
          {notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span aria-hidden className="text-fg-muted">
                —
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
