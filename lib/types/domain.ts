export type LoreEntryType =
  | "character"
  | "location"
  | "faction"
  | "species"
  | "item"
  | "system"
  | "event"
  | "term"
  | "note";

export type CanonStatus = "draft" | "canon" | "retconned" | "archived";

export type StoryDraftStatus = "planning" | "drafting" | "revising" | "complete" | "archived";

export type WorkspaceUser = {
  id: string;
  email: string;
  displayName: string;
  plan: "free" | "creator" | "studio";
};

export type Universe = {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Story = {
  id: string;
  userId: string;
  universeId: string;
  title: string;
  synopsis: string;
  draftStatus: StoryDraftStatus;
  wordCount: number;
  timelinePosition?: string;
  createdAt: string;
  updatedAt: string;
};

export type Chapter = {
  id: string;
  storyId: string;
  title: string;
  sortOrder: number;
  wordCount: number;
};

export type Scene = {
  id: string;
  chapterId: string;
  title: string;
  body: string;
  sortOrder: number;
  wordCount: number;
};

export type FirstMention = {
  storyTitle: string;
  chapterTitle: string;
  sceneTitle: string;
  excerpt: string;
};

export type LoreEntry = {
  id: string;
  userId: string;
  universeId: string;
  type: LoreEntryType;
  name: string;
  shortSummary: string;
  fullDescription: string;
  tags: string[];
  canonStatus: CanonStatus;
  firstMention?: FirstMention;
  appearances: Array<{
    storyTitle: string;
    chapterTitle: string;
    sceneTitle: string;
  }>;
  relatedEntryIds: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type TimelineEvent = {
  id: string;
  userId: string;
  universeId: string;
  title: string;
  description: string;
  dateLabel: string;
  sortOrder: number;
  linkedEntryIds: string[];
};

export type ContinuityIssue = {
  id: string;
  severity: "info" | "warning" | "error";
  title: string;
  description: string;
  relatedEntryId?: string;
  location?: string;
};

export type DashboardSnapshot = {
  user: WorkspaceUser;
  universes: Universe[];
  stories: Story[];
  loreEntries: LoreEntry[];
  continuityIssues: ContinuityIssue[];
};
