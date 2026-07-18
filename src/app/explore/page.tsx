import { searchAll } from "@/db/queries";
import { ExploreResults } from "@/components/ExploreResults";
import { ScaffoldView } from "@/components/ScaffoldView";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return (
      <ScaffoldView
        eyebrow="Explore"
        title="Search results, grouped by type"
        description="The landing point for the universal search bar. Try a query from the homepage — a year, a person, a work, or a place — grouped results appear here."
        route="/explore"
        notes={[
          "Query params: ?q=",
          "Matches names/titles in both English and Japanese, partial and case-insensitive.",
          "北斎 / Hokusai / Katsushika Hokusai all resolve to the same person.",
        ]}
      />
    );
  }

  const results = await searchAll(query);

  return <ExploreResults query={query} results={results} />;
}
