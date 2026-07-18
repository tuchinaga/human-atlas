export type CategoryKey =
  | "history"
  | "society"
  | "art"
  | "music"
  | "literature"
  | "science"
  | "technology"
  | "architecture"
  | "ideas";

export const CATEGORY_ORDER: CategoryKey[] = [
  "history",
  "society",
  "art",
  "music",
  "literature",
  "science",
  "technology",
  "architecture",
  "ideas",
];

// Maps to the --color-cat-* tokens defined in globals.css
export const CATEGORY_COLOR_VAR: Record<CategoryKey, string> = {
  history: "var(--color-cat-history)",
  society: "var(--color-cat-society)",
  art: "var(--color-cat-art)",
  music: "var(--color-cat-music)",
  literature: "var(--color-cat-literature)",
  science: "var(--color-cat-science)",
  technology: "var(--color-cat-technology)",
  architecture: "var(--color-cat-architecture)",
  ideas: "var(--color-cat-ideas)",
};
