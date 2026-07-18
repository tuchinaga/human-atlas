import { getJourneyBySlug } from "@/db/queries";
import { JourneyView } from "@/components/JourneyView";
import { ScaffoldView } from "@/components/ScaffoldView";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getJourneyBySlug(slug);

  if (!record) {
    const title = slug
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");
    return (
      <ScaffoldView
        eyebrow="Journey"
        title={title}
        description="Not yet ingested. Try /journeys/paris-1889 for a seeded journey."
        route={`/journeys/${slug}`}
        notes={[
          "An editor sequences existing entity/year/place references; the renderer supplies the components.",
          "Featured on the homepage as one rotating entry point.",
        ]}
      />
    );
  }

  return (
    <JourneyView
      title={record.journey.title}
      titleJa={record.journey.titleJa}
      description={record.journey.description}
      descriptionJa={record.journey.descriptionJa}
      steps={record.steps}
    />
  );
}
