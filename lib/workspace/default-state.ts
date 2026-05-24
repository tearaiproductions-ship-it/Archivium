import { demoDashboardSnapshot } from "@/lib/database/demo-data";
import type { WorkspaceState } from "@/lib/workspace/workspace-state";
import { createId } from "@/lib/utils";

export function createDefaultWorkspaceState(): WorkspaceState {
  const now = new Date().toISOString();

  const chapters = [
    {
      id: "chapter-ember-1",
      storyId: "ember-road",
      title: "Chapter 1: Cinders",
      sortOrder: 1,
      wordCount: 0
    }
  ];

  const scenes = [
    {
      id: "scene-ember-1",
      chapterId: "chapter-ember-1",
      title: "Bridge Crossing",
      body:
        "Mara crossed the Black Glass Bridge before the bells woke the harbor.\n\nBelow, ash boats moved like ghosts through the red fog.",
      sortOrder: 1,
      wordCount: 0
    }
  ];

  return {
    version: 1,
    updatedAt: now,
    user: demoDashboardSnapshot.user,
    universes: demoDashboardSnapshot.universes,
    stories: demoDashboardSnapshot.stories,
    chapters,
    scenes,
    loreEntries: demoDashboardSnapshot.loreEntries,
    timelineEvents: [],
    storyDrafts: {
      "ember-road": scenes[0].body
    },
    continuityIssues: demoDashboardSnapshot.continuityIssues
  };
}

export function createEmptyWorkspaceState(): WorkspaceState {
  const now = new Date().toISOString();

  return {
    version: 1,
    updatedAt: now,
    user: {
      id: "demo-user",
      email: "writer@example.com",
      displayName: "Writer",
      plan: "free"
    },
    universes: [],
    stories: [],
    chapters: [],
    scenes: [],
    loreEntries: [],
    timelineEvents: [],
    storyDrafts: {},
    continuityIssues: []
  };
}

export function createStarterChapterAndScene(storyId: string, storyTitle: string) {
  const chapterId = createId();
  const sceneId = createId();

  return {
    chapter: {
      id: chapterId,
      storyId,
      title: "Chapter 1",
      sortOrder: 1,
      wordCount: 0
    },
    scene: {
      id: sceneId,
      chapterId,
      title: "Opening Scene",
      body: `Start writing ${storyTitle}...\n`,
      sortOrder: 1,
      wordCount: 0
    }
  };
}
