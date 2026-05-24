import { notFound } from "next/navigation";

import { WritingEditor } from "@/components/writing/writing-editor";
import { getDashboardSnapshot } from "@/lib/services/workspace-service";

export default async function WritePage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params;
  const snapshot = await getDashboardSnapshot();
  const story = snapshot.stories.find((candidate) => candidate.id === storyId) ?? snapshot.stories[0];

  if (!story) {
    notFound();
  }

  return (
    <WritingEditor
      story={story}
      initialLoreEntries={snapshot.loreEntries.filter((entry) => entry.universeId === story.universeId)}
    />
  );
}
