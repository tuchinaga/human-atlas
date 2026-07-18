import { ScaffoldView } from "@/components/ScaffoldView";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <ScaffoldView
      eyebrow="Explore"
      title={q ? `“${q}”` : "Search results, grouped by type"}
      description={
        q
          ? `You searched for “${q}”. The search index isn't wired up yet — try a direct link instead, e.g. /year/1889, /people/vincent-van-gogh, or /works/the-starry-night.`
          : "The landing point for the universal search bar. A query like '1889' should return a Year, an Event, a Work, a Building, a Person active that year, and a Japan-specific result — each in its own group."
      }
      route={q ? `/explore?q=${encodeURIComponent(q)}` : "/explore"}
      notes={[
        "Query params: ?q=, ?type=person|work|place|event|movement, ?view=map",
        "Backed by the unified search index (section 23): names, aliases, original titles, romanized readings.",
        "北斎 / Hokusai / Katsushika Hokusai must resolve to one entity.",
      ]}
    />
  );
}
