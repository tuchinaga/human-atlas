import { getNetworkData } from "@/db/queries";
import { NetworkView } from "@/components/NetworkView";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const { nodes, edges } = await getNetworkData();
  return <NetworkView nodes={nodes} edges={edges} />;
}
