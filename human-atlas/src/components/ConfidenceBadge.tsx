const CONFIDENCE_COLOR: Record<string, string> = {
  verified: "#4b7a5b",
  probable: "#4b7a5b",
  approximate: "#b08b4f",
  disputed: "#a13d3d",
  unknown: "#8a8272",
};

export function ConfidenceBadge({
  confidence,
  label,
}: {
  confidence: string;
  label: string;
}) {
  const color = CONFIDENCE_COLOR[confidence] ?? CONFIDENCE_COLOR.unknown;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] uppercase tracking-[0.06em]"
      style={{ borderColor: color, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} aria-hidden />
      {label}
    </span>
  );
}
