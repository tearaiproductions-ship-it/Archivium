import { demoDashboardSnapshot } from "@/lib/database/demo-data";
import type { DashboardSnapshot } from "@/lib/types/domain";

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  // The UI works with demo data until Supabase credentials are configured.
  // Database-facing methods can be implemented behind this service without changing screens.
  return demoDashboardSnapshot;
}
