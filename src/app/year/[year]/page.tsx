import { YearView } from "@/components/YearView";

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return <YearView year={year} />;
}
