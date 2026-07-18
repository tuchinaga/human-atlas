import { getWorkBySlug, getMeanwhile } from "@/db/queries";
import { WorkView } from "@/components/WorkView";
import { ScaffoldView } from "@/components/ScaffoldView";
import type { Category } from "@/db/schema";

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ trail?: string }>;
}) {
  const { slug } = await params;
  const { trail } = await searchParams;
  const record = await getWorkBySlug(slug);

  if (!record) {
    const title = slug
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");
    return (
      <ScaffoldView
        eyebrow="Work"
        title={title}
        description="Not yet ingested. Try /works/the-starry-night, /works/eiffel-tower or /works/symphony-no-1 for seeded records."
        route={`/works/${slug}`}
        notes={[
          "Image renders only when an Image Asset with a known rights status is attached (section 19).",
          "Includes a Meanwhile section positioned at the work's creation date and place.",
          "Interpretation and provenance are never fabricated; uncertain fields carry a confidence label.",
        ]}
      />
    );
  }

  const year = record.work.creationStartDate
    ? Number(record.work.creationStartDate.slice(0, 4))
    : null;
  const meanwhile = year
    ? await getMeanwhile(year, { kind: "work", slug })
    : [];

  return (
    <WorkView
      work={{
        slug: record.work.slug,
        title: record.work.title,
        titleJa: record.work.titleJa,
        workType: record.work.workType,
        workTypeJa: record.work.workTypeJa,
        category: record.work.category as Category,
        displayDate: record.work.displayDate,
        medium: record.work.medium,
        mediumJa: record.work.mediumJa,
        dimensions: record.work.dimensions,
        currentInstitution: record.work.currentInstitution,
        description: record.work.description,
        descriptionJa: record.work.descriptionJa,
        confidence: record.work.confidence,
      }}
      creator={record.creator}
      creationPlace={record.creationPlace}
      meanwhile={meanwhile}
      year={year}
      image={record.image}
      movement={record.movement}
      trail={trail}
    />
  );
}
