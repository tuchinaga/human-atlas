import { getPersonBySlug } from "@/db/queries";
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
    />
  );
}
