import { PageShell } from "@/components/PageShell";
import { SearchHero } from "@/components/SearchHero";
import { EntryPoints } from "@/components/EntryPoints";
import { FeaturedJourney } from "@/components/FeaturedJourney";

export default function HomePage() {
  return (
    <PageShell>
      <SearchHero />
      <EntryPoints />
      <FeaturedJourney />
    </PageShell>
  );
}
