"use client";

export function FilterChip({
  active,
  onClick,
  label,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] transition-colors ${
        active
          ? "border-fg bg-fg text-bg"
          : "border-border text-fg-soft hover:border-fg hover:text-fg"
      }`}
    >
      {dotColor && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: active ? "currentColor" : dotColor }}
          aria-hidden
        />
      )}
      {label}
    </button>
  );
}
