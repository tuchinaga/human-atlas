import { ScaffoldView } from "@/components/ScaffoldView";

export default async function MovementPage({
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
      eyebrow="Movement"
      title={title}
      description="A movement's origin places, member people and works, and its predecessor and successor movements — e.g. the line from Ukiyo-e toward Impressionism that section 18's 'Editorial Journeys' can narrate."
      route={`/movements/${slug}`}
      notes={[
        "Movements link outward to Works and People rather than owning duplicated content.",
        "Used as a filter dimension inside Timeline, Map and Compare views.",
      ]}
    />
  );
}
