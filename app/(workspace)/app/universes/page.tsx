import { UniverseManager } from "@/components/universes/universe-manager";
import { getDashboardSnapshot } from "@/lib/services/workspace-service";

export default async function UniversesPage() {
  const snapshot = await getDashboardSnapshot();

  return <UniverseManager initialUniverses={snapshot.universes} />;
}
