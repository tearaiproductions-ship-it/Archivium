import type { LoreEntry, LoreEntryType } from "@/lib/types/domain";
import { slugify } from "@/lib/utils";

export type CreateLoreEntryInput = {
  userId: string;
  universeId: string;
  type: LoreEntryType;
  name: string;
  shortSummary?: string;
  fullDescription?: string;
  tags?: string[];
  source?: {
    storyTitle: string;
    chapterTitle: string;
    sceneTitle: string;
    excerpt: string;
  };
};

export function createLoreEntryDraft(input: CreateLoreEntryInput): LoreEntry {
  const now = new Date().toISOString();

  return {
    id: `${slugify(input.name)}-${Date.now()}`,
    userId: input.userId,
    universeId: input.universeId,
    type: input.type,
    name: input.name.trim(),
    shortSummary: input.shortSummary?.trim() ?? "",
    fullDescription: input.fullDescription?.trim() ?? "",
    tags: input.tags ?? [],
    canonStatus: "draft",
    firstMention: input.source,
    appearances: input.source
      ? [
          {
            storyTitle: input.source.storyTitle,
            chapterTitle: input.source.chapterTitle,
            sceneTitle: input.source.sceneTitle
          }
        ]
      : [],
    relatedEntryIds: [],
    notes: "",
    createdAt: now,
    updatedAt: now
  };
}

export function searchLoreEntries(entries: LoreEntry[], query: string, universeId?: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesUniverse = universeId ? entry.universeId === universeId : true;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      entry.name.toLowerCase().includes(normalizedQuery) ||
      entry.shortSummary.toLowerCase().includes(normalizedQuery) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesUniverse && matchesQuery;
  });
}

export function findPossibleDuplicateEntries(entries: LoreEntry[]) {
  const byName = new Map<string, LoreEntry[]>();

  entries.forEach((entry) => {
    const key = entry.name.toLowerCase().replace(/^the\s+/, "");
    byName.set(key, [...(byName.get(key) ?? []), entry]);
  });

  return Array.from(byName.values()).filter((group) => group.length > 1);
}
