import { getEventBySlug, getMeanwhile } from "@/db/queries";
import { EventView } from "@/components/EventView";
import { ScaffoldView } from "@/components/ScaffoldView";
import type { Category } from "@/db/schema";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getEventBySlug(slug);

  if (!record) {
    const title = slug
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");
    return (
      <ScaffoldView
        eyebrow="Event"
        title={title}
        description="Not yet ingested. Try /events/promulgation-of-the-meiji-constitution or /events/exposition-universelle-1889 for seeded records."
        route={`/events/${slug}`}
        notes={[
          "Maps to the Event entity in the normalized schema (section 21).",
          "Feeds the Meanwhile engine for any person, work or place active during its date range.",
        ]}
      />
    );
  }

  const year = record.event.startDate
    ? Number(record.event.startDate.slice(0, 4))
    : null;
  const meanwhile = year
    ? await getMeanwhile(year, { kind: "event", slug })
    : [];

  return (
    <EventView
      event={{
        title: record.event.title,
        titleJa: record.event.titleJa,
        category: record.event.category as Category,
        displayDate: record.event.displayDate,
        description: record.event.description,
        descriptionJa: record.event.descriptionJa,
        confidence: record.event.confidence,
      }}
      place={record.place}
      relatedWorks={record.relatedWorks}
      meanwhile={meanwhile}
      year={year}
    />
  );
}
