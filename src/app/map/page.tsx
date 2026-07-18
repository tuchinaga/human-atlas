import { getMapPlaces } from "@/db/queries";
import { MapExplorer } from "@/components/MapExplorer";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const places = await getMapPlaces();
  return <MapExplorer places={places} />;
}
