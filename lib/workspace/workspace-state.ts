import type {
  Chapter,
  ContinuityIssue,
  DashboardSnapshot,
  LoreEntry,
  Scene,
  Story,
  TimelineEvent,
  Universe,
  WorkspaceUser
} from "@/lib/types/domain";

export type WorkspaceState = {
  version: 1;
  updatedAt: string;
  user: WorkspaceUser;
  universes: Universe[];
  stories: Story[];
  chapters: Chapter[];
  scenes: Scene[];
  loreEntries: LoreEntry[];
  timelineEvents: TimelineEvent[];
  storyDrafts: Record<string, string>;
  continuityIssues: ContinuityIssue[];
};

export function toDashboardSnapshot(state: WorkspaceState): DashboardSnapshot {
  return {
    user: state.user,
    universes: state.universes,
    stories: state.stories,
    loreEntries: state.loreEntries,
    continuityIssues: state.continuityIssues
  };
}
