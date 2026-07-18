import { PageShell } from "@/components/PageShell";
import { SearchHero } from "@/components/SearchHero";
import { EntryPoints } from "@/components/EntryPoints";
import { FeaturedJourney } from "@/components/FeaturedJourney";
import { getRandomFeaturedJourney } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const journey = await getRandomFeaturedJourney();

  return (
    <PageShell>
      <SearchHero />
      <EntryPoints />
      {journey && <FeaturedJourney journey={journey} />}
    </PageShell>
  );
}
