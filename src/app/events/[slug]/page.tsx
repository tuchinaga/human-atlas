import { ScaffoldView } from "@/components/ScaffoldView";

export default async function EventPage({
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
      eyebrow="Event"
      title={title}
      description="Historical events carry a category, a date range rather than a forced single date, related places, participants and works, and a significance score used to decide which cards surface first on a crowded year."
      route={`/events/${slug}`}
      notes={[
        "Maps to the Event entity in the normalized schema (section 21).",
        "Feeds the Meanwhile engine for any person, work or place active during its date range.",
      ]}
    />
  );
}
