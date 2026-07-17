import { ScaffoldView } from "@/components/ScaffoldView";

export default async function PersonPage({
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
      eyebrow="Person"
      title={name}
      description="Portrait, life timeline, geographic journey, works, teachers, collaborators, patrons, contemporaries and influences resolve here from the Person entity and its Location Period records."
      route={`/people/${slug}`}
      notes={[
        "Age comparison: shows this person's age against any selected year.",
        "Geographic journey renders on the Map view as chronological, connected points.",
        "Documented vs. inferred relationships are visually distinguished — never implied by shared city alone.",
      ]}
    />
  );
}
