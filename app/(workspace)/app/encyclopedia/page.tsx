import { EncyclopediaDashboard } from "@/components/encyclopedia/encyclopedia-dashboard";
import { getDashboardSnapshot } from "@/lib/services/workspace-service";

export default async function EncyclopediaPage() {
  const snapshot = await getDashboardSnapshot();

  return <EncyclopediaDashboard initialEntries={snapshot.loreEntries} universes={snapshot.universes} />;
}
