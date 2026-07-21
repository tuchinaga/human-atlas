import { getPeopleIndex } from "@/db/queries";
import { PeopleIndexView } from "@/components/PeopleIndexView";

export const dynamic = "force-dynamic";

export default async function PeopleIndexPage() {
  const people = await getPeopleIndex();
  return <PeopleIndexView people={people} />;
}
