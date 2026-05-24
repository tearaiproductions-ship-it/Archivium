import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getDashboardSnapshot } from "@/lib/services/workspace-service";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return <DashboardOverview snapshot={snapshot} />;
}
