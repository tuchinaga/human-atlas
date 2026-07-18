import { PageShell } from "@/components/PageShell";

export function EntitySkeleton() {
  return (
    <PageShell>
      <div className="ha-pulse h-3 w-20 rounded-sm bg-bg-raised" />
      <div className="ha-pulse mt-4 h-10 w-2/3 max-w-md rounded-sm bg-bg-raised" />
      <div className="ha-pulse mt-6 h-4 w-40 rounded-sm bg-bg-raised" />
      <div className="ha-pulse mt-8 h-48 w-full max-w-xl rounded-sm bg-bg-raised" />
      <style>{`
        .ha-pulse { animation: ha-pulse-anim 1.4s ease-in-out infinite; }
        @keyframes ha-pulse-anim {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ha-pulse { animation: none; opacity: 0.4; }
        }
      `}</style>
    </PageShell>
  );
}
