import { ScaffoldView } from "@/components/ScaffoldView";

export default function SourcesPage() {
  return (
    <ScaffoldView
      eyebrow="Sources"
      title="Where this data comes from"
      description="A public record of every institution and dataset Human Atlas draws on — Wikidata, VIAF, Getty ULAN, MusicBrainz, museum object APIs, ISNI and Library of Congress authority records — with reliability level and last-accessed date."
      route="/sources"
      notes={[
        "Generated from the Source entity, not hand-maintained prose.",
        "Raw source payloads are kept separate from normalized data so provenance is always traceable.",
      ]}
    />
  );
}
