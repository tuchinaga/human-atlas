import { ScaffoldView } from "@/components/ScaffoldView";

export default function ExplorePage() {
  return (
    <ScaffoldView
      eyebrow="Explore"
      title="Search results, grouped by type"
      description="The landing point for the universal search bar. A query like '1889' should return a Year, an Event, a Work, a Building, a Person active that year, and a Japan-specific result — each in its own group."
      route="/explore"
      notes={[
        "Query params: ?q=, ?type=person|work|place|event|movement, ?view=map",
        "Backed by the unified search index (section 23): names, aliases, original titles, romanized readings.",
        "北斎 / Hokusai / Katsushika Hokusai must resolve to one entity.",
      ]}
    />
  );
}
