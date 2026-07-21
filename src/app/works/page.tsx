import { getWorksIndex } from "@/db/queries";
import { WorksIndexView } from "@/components/WorksIndexView";

export const dynamic = "force-dynamic";

export default async function WorksIndexPage() {
  const works = await getWorksIndex();
  return <WorksIndexView works={works} />;
}
