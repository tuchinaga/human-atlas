import { YearView } from "@/components/YearView";
import { getYearCards, getAgeComparison } from "@/db/queries";

export default async function YearPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ trail?: string }>;
}) {
  const { year } = await params;
  const { trail } = await searchParams;
  const yearNum = Number(year);

  const [cards, ages] = await Promise.all([
    Number.isFinite(yearNum) ? getYearCards(yearNum) : Promise.resolve([]),
    Number.isFinite(yearNum) ? getAgeComparison(yearNum) : Promise.resolve([]),
  ]);

  return (
    <YearView
      year={year}
      cards={cards}
      ages={ages.map((a) => ({
        name: a.name,
        nameJa: a.nameJa,
        slug: a.slug,
        age: a.age,
      }))}
      trail={trail}
    />
  );
}
