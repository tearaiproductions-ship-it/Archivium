import { StoryManager } from "@/components/stories/story-manager";
import { getDashboardSnapshot } from "@/lib/services/workspace-service";

export default async function StoriesPage() {
  const snapshot = await getDashboardSnapshot();

  return <StoryManager initialStories={snapshot.stories} initialUniverses={snapshot.universes} />;
}
