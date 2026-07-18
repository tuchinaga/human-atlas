import { getPersonBySlug, getYearCards } from "@/db/queries";
import { PersonView } from "@/components/PersonView";
import { ScaffoldView } from "@/components/ScaffoldView";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getPersonBySlug(slug);

  if (!record) {
    const name = slug
      .split("-")
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ");
    return (
      <ScaffoldView
        eyebrow="Person"
        title={name}
        description="Not yet ingested. Try /people/vincent-van-gogh or /people/katsushika-hokusai for seeded profiles with a real biography, geographic journey and linked works."
        route={`/people/${slug}`}
        notes={[
          "Age comparison: shows this person's age against any selected year.",
          "Geographic journey renders on the Map view as chronological, connected points.",
          "Documented vs. inferred relationships are visually distinguished — never implied by shared city alone.",
        ]}
      />
    );
  }

  // "Current selected year" per the context-panel brief: default to the
  // year of their earliest known work, since that's the most natural
  // anchor for "meanwhile in the world" without an explicit year picker.
  const worksWithDates = record.works
    .filter((w) => w.creationStartDate)
    .sort((a, b) => (a.creationStartDate! < b.creationStartDate! ? -1 : 1));
  const spotlightYear = worksWithDates[0]
    ? Number(worksWithDates[0].creationStartDate!.slice(0, 4))
    : null;
  const meanwhile = spotlightYear ? await getYearCards(spotlightYear) : [];

  return (
    <PersonView
      person={{
        name: record.person.name,
        nameJa: record.person.nameJa,
        birthDate: record.person.birthDate,
        deathDate: record.person.deathDate,
        biography: record.person.biography,
        biographyJa: record.person.biographyJa,
        occupations: record.person.occupationsJson
          ? (JSON.parse(record.person.occupationsJson) as string[])
          : [],
      }}
      journey={record.journey}
      works={record.works}
      image={record.image}
      movements={record.movements}
      contemporaries={record.contemporaries}
      currentLocation={record.currentLocation}
      spotlightYear={spotlightYear}
      meanwhile={meanwhile}
    />
  );
}
