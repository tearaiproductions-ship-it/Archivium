import { TimelineView } from "@/components/timeline/timeline-view";
import { getDashboardSnapshot } from "@/lib/services/workspace-service";

export default async function TimelinePage() {
  const snapshot = await getDashboardSnapshot();

  return <TimelineView universes={snapshot.universes} />;
}
