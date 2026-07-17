export type CategoryKey =
  | "history"
  | "japan"
  | "art"
  | "music"
  | "literature"
  | "science"
  | "philosophy"
  | "architecture";

export const CATEGORY_ORDER: CategoryKey[] = [
  "history",
  "japan",
  "art",
  "music",
  "literature",
  "science",
  "philosophy",
  "architecture",
];

// Maps to the --color-cat-* tokens defined in globals.css
export const CATEGORY_COLOR_VAR: Record<CategoryKey, string> = {
  history: "var(--color-cat-history)",
  japan: "var(--color-cat-japan)",
  art: "var(--color-cat-art)",
  music: "var(--color-cat-music)",
  literature: "var(--color-cat-literature)",
  science: "var(--color-cat-science)",
  philosophy: "var(--color-cat-philosophy)",
  architecture: "var(--color-cat-architecture)",
};
