import type { ContinuityIssue, LoreEntry, Scene, Story, TimelineEvent } from "@/lib/types/domain";
import { findPossibleDuplicateEntries } from "@/lib/services/lore-service";

export function buildContinuityIssues(params: {
  entries: LoreEntry[];
  scenes: Scene[];
  stories: Story[];
  timelineEvents: TimelineEvent[];
}): ContinuityIssue[] {
  const issues: ContinuityIssue[] = [];

  findPossibleDuplicateEntries(params.entries).forEach((duplicates, index) => {
    issues.push({
      id: `duplicate-${index}`,
      severity: "warning",
      title: "Possible duplicate lore entries",
      description: duplicates.map((entry) => entry.name).join(", "),
      relatedEntryId: duplicates[0]?.id
    });
  });

  params.entries
    .filter((entry) => entry.type === "character" && entry.tags.includes("dead"))
    .forEach((entry) => {
      const laterAppearance = entry.appearances.at(-1);
      if (laterAppearance) {
        issues.push({
          id: `dead-character-${entry.id}`,
          severity: "warning",
          title: `${entry.name} is marked dead`,
          description: "Review later appearances to confirm the timeline order is intentional.",
          relatedEntryId: entry.id,
          location: `${laterAppearance.storyTitle} / ${laterAppearance.chapterTitle}`
        });
      }
    });

  params.scenes.forEach((scene) => {
    const unresolvedMarkers = scene.body.match(/\[\[([^\]]+)\?\]\]/g) ?? [];

    unresolvedMarkers.forEach((marker, index) => {
      issues.push({
        id: `unresolved-${scene.id}-${index}`,
        severity: "info",
        title: "Unresolved lore mention",
        description: `${marker.replace("[[", "").replace("?]]", "")} has not been linked to an entry.`,
        location: scene.title
      });
    });
  });

  return issues;
}
