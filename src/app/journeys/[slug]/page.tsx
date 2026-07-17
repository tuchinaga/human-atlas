import { ScaffoldView } from "@/components/ScaffoldView";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <ScaffoldView
      eyebrow="Journey"
      title={title}
      description="A curated narrative path — 'The World of 1889', 'Hokusai and the World Beyond Japan' — assembled entirely from existing Entity, Event, Map and Timeline components rather than a hard-coded page."
      route={`/journeys/${slug}`}
      notes={[
        "An editor sequences existing entity/year/place references; the renderer supplies the components.",
        "Featured on the homepage as one rotating entry point.",
      ]}
    />
  );
}
