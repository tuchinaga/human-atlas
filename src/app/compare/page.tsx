import { getAllPeopleForPicker, getCompareData } from "@/db/queries";
import { CompareView } from "@/components/CompareView";
import { ComparePicker } from "@/components/ComparePicker";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a: slugA, b: slugB } = await searchParams;

  if (slugA && slugB && slugA !== slugB) {
    const { a, b } = await getCompareData(slugA, slugB);
    if (a && b) {
      return (
        <CompareView
          a={{
            slug: a.person.slug,
            name: a.person.name,
            nameJa: a.person.nameJa,
            birthDate: a.person.birthDate,
            deathDate: a.person.deathDate,
            occupations: a.person.occupationsJson
              ? (JSON.parse(a.person.occupationsJson) as string[])
              : [],
            works: a.works,
            movements: a.movements,
            journey: a.journey,
            image: a.image,
          }}
          b={{
            slug: b.person.slug,
            name: b.person.name,
            nameJa: b.person.nameJa,
            birthDate: b.person.birthDate,
            deathDate: b.person.deathDate,
            occupations: b.person.occupationsJson
              ? (JSON.parse(b.person.occupationsJson) as string[])
              : [],
            works: b.works,
            movements: b.movements,
            journey: b.journey,
            image: b.image,
          }}
        />
      );
    }
  }

  const people = await getAllPeopleForPicker();
  return <ComparePicker people={people} />;
}
