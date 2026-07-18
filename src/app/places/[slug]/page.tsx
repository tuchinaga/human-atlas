import { getPlaceBySlug } from "@/db/queries";
import { PlaceView } from "@/components/PlaceView";
import { ScaffoldView } from "@/components/ScaffoldView";

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getPlaceBySlug(slug);

  if (!record) {
    const name = slug
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");
    return (
      <ScaffoldView
        eyebrow="Place"
        title={name}
        description="Not yet ingested. Try /places/paris, /places/saint-remy-de-provence or /places/tokyo for seeded records."
        route={`/places/${slug}`}
        notes={[
          "Pairs with the Map view's Year Map and City View modes.",
          "A dedicated year slider re-filters everything shown for the place.",
          "Restrained marker clustering at low zoom — never a flooded map.",
        ]}
      />
    );
  }

  return (
    <PlaceView
      place={{
        name: record.place.name,
        nameJa: record.place.nameJa,
        placeType: record.place.placeType,
      }}
      worksHere={record.worksHere}
      eventsHere={record.eventsHere}
      residents={record.residents}
    />
  );
}
