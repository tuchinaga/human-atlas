import { getMovementBySlug } from "@/db/queries";
import { MovementView } from "@/components/MovementView";
import { ScaffoldView } from "@/components/ScaffoldView";

export default async function MovementPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getMovementBySlug(slug);

  if (!record) {
    const title = slug
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");
    return (
      <ScaffoldView
        eyebrow="Movement"
        title={title}
        description="Not yet ingested. Try /movements/impressionism, /movements/ukiyo-e or /movements/cubism for seeded records."
        route={`/movements/${slug}`}
        notes={[
          "Movements link outward to Works and People rather than owning duplicated content.",
          "Used as a filter dimension inside Timeline, Map and Compare views.",
        ]}
      />
    );
  }

  return (
    <MovementView
      movement={{
        name: record.movement.name,
        nameJa: record.movement.nameJa,
        description: record.movement.description,
        descriptionJa: record.movement.descriptionJa,
      }}
      members={record.members}
      works={record.works}
    />
  );
}
