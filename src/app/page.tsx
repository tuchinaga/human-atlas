import { PageShell } from "@/components/PageShell";
import { SearchHero } from "@/components/SearchHero";
import { EntryPoints } from "@/components/EntryPoints";
import { FeaturedJourney } from "@/components/FeaturedJourney";
import { getWorkBySlug } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const starryNight = await getWorkBySlug("the-starry-night");

  return (
    <PageShell>
      <SearchHero />
      <EntryPoints />
      <FeaturedJourney image={starryNight?.image ?? null} />
    </PageShell>
  );
}
