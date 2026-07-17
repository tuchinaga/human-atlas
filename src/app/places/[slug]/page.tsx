import { ScaffoldView } from "@/components/ScaffoldView";

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = slug
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <ScaffoldView
      eyebrow="Place"
      title={name}
      description="A city treated as a cultural node rather than a coordinate pair: artists who lived or worked there, buildings, exhibitions, political events, performances and publications, filterable by year."
      route={`/places/${slug}`}
      notes={[
        "Pairs with the Map view's Year Map and City View modes.",
        "A dedicated year slider re-filters everything shown for the place.",
        "Restrained marker clustering at low zoom — never a flooded map.",
      ]}
    />
  );
}
