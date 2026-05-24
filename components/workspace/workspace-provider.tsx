"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import { createStarterChapterAndScene, createEmptyWorkspaceState } from "@/lib/workspace/default-state";
import type { WorkspaceState } from "@/lib/workspace/workspace-state";
import type { LoreEntry, LoreEntryType, Story, Universe } from "@/lib/types/domain";
import { createLoreEntryDraft } from "@/lib/services/lore-service";
import { countWords, createId } from "@/lib/utils";

const LOCAL_STORAGE_KEY = "lorewrite:workspace:v1";
function migrateLegacyWorkspace(): WorkspaceState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const universesRaw = window.localStorage.getItem("lorewrite:universes");
  const storiesRaw = window.localStorage.getItem("lorewrite:stories");
  const loreRaw = window.localStorage.getItem("lorewrite:loreEntries");

  if (!universesRaw && !storiesRaw && !loreRaw) {
    return null;
  }

  const base = createEmptyWorkspaceState();
  try {
    if (universesRaw) base.universes = JSON.parse(universesRaw);
    if (storiesRaw) base.stories = JSON.parse(storiesRaw);
    if (loreRaw) base.loreEntries = JSON.parse(loreRaw);
    base.updatedAt = new Date().toISOString();
    return base;
  } catch {
    return null;
  }
}



type WorkspaceContextValue = {
  isReady: boolean;
  isSaving: boolean;
  saveError: string | null;
  state: WorkspaceState;
  createUniverse: (name: string, description: string) => Universe | null;
  createStory: (input: {
    title: string;
    synopsis: string;
    mode: "existing" | "new";
    universeId?: string;
    newUniverseName?: string;
  }) => Story | null;
  updateStoryDraft: (storyId: string, body: string) => void;
  addLoreEntry: (entry: LoreEntry) => void;
  resetWorkspace: () => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

async function fetchWorkspace(): Promise<WorkspaceState> {
  const response = await fetch("/api/workspace", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load workspace");
  }
  return response.json();
}

async function persistWorkspace(state: WorkspaceState): Promise<WorkspaceState> {
  const response = await fetch("/api/workspace", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state)
  });

  if (!response.ok) {
    throw new Error("Unable to save workspace");
  }

  return response.json();
}

function readLocalWorkspace(): WorkspaceState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as WorkspaceState;
  } catch {
    return null;
  }
}

function writeLocalWorkspace(state: WorkspaceState) {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const remote = await fetchWorkspace();
        const legacy = migrateLegacyWorkspace();
        const local = readLocalWorkspace() ?? legacy;

        if (!cancelled) {
          if (local && new Date(local.updatedAt).getTime() > new Date(remote.updatedAt).getTime()) {
            setState(local);
            await persistWorkspace(local);
          } else {
            setState(remote);
            writeLocalWorkspace(remote);
          }
        }
      } catch {
        const legacy = migrateLegacyWorkspace();
        const local = readLocalWorkspace() ?? legacy;
        if (!cancelled) {
          setState(local ?? createEmptyWorkspaceState());
        }
      } finally {
        if (!cancelled) {
          hasHydratedRef.current = true;
          setIsReady(true);
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !state || !hasHydratedRef.current) {
      return;
    }

    writeLocalWorkspace(state);
    const timeout = window.setTimeout(async () => {
      setIsSaving(true);
      setSaveError(null);
      try {
        const saved = await persistWorkspace(state);
        setState(saved);
        writeLocalWorkspace(saved);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : "Save failed");
      } finally {
        setIsSaving(false);
      }
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [state, isReady]);

  const createUniverse = useCallback((name: string, description: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return null;
    }

    const now = new Date().toISOString();
    const universe: Universe = {
      id: createId("universe"),
      userId: "demo-user",
      name: trimmed,
      description: description.trim(),
      createdAt: now,
      updatedAt: now
    };

    setState((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        updatedAt: now,
        universes: [universe, ...current.universes]
      };
    });

    return universe;
  }, []);

  const createStory = useCallback(
    (input: {
      title: string;
      synopsis: string;
      mode: "existing" | "new";
      universeId?: string;
      newUniverseName?: string;
    }) => {
      const trimmedTitle = input.title.trim();
      if (!trimmedTitle) {
        return null;
      }

      const now = new Date().toISOString();
      let selectedUniverseId = input.universeId ?? "";
      let createdUniverse: Universe | null = null;

      if (input.mode === "new") {
        const universeName = input.newUniverseName?.trim() || `${trimmedTitle} Universe`;
        createdUniverse = {
          id: createId("universe"),
          userId: "demo-user",
          name: universeName,
          description: `Lore database for ${trimmedTitle}.`,
          createdAt: now,
          updatedAt: now
        };
        selectedUniverseId = createdUniverse.id;
      }

      if (!selectedUniverseId) {
        return null;
      }

      const story: Story = {
        id: createId("story"),
        userId: "demo-user",
        universeId: selectedUniverseId,
        title: trimmedTitle,
        synopsis: input.synopsis.trim(),
        draftStatus: "planning",
        wordCount: 0,
        createdAt: now,
        updatedAt: now
      };

      const { chapter, scene } = createStarterChapterAndScene(story.id, story.title);

      setState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          updatedAt: now,
          universes: createdUniverse ? [createdUniverse, ...current.universes] : current.universes,
          stories: [story, ...current.stories],
          chapters: [chapter, ...current.chapters],
          scenes: [scene, ...current.scenes],
          storyDrafts: {
            ...current.storyDrafts,
            [story.id]: scene.body
          }
        };
      });

      return story;
    },
    []
  );

  const updateStoryDraft = useCallback((storyId: string, body: string) => {
    const words = countWords(body);
    const now = new Date().toISOString();

    setState((current) => {
      if (!current) {
        return current;
      }

      const scenes = current.scenes.map((scene) => {
        const chapter = current.chapters.find((item) => item.id === scene.chapterId);
        if (chapter?.storyId !== storyId || scene.sortOrder !== 1) {
          return scene;
        }

        return {
          ...scene,
          body,
          wordCount: words
        };
      });

      return {
        ...current,
        updatedAt: now,
        scenes,
        storyDrafts: {
          ...current.storyDrafts,
          [storyId]: body
        },
        stories: current.stories.map((story) =>
          story.id === storyId ? { ...story, wordCount: words, updatedAt: now, draftStatus: "drafting" } : story
        )
      };
    });
  }, []);

  const addLoreEntry = useCallback((entry: LoreEntry) => {
    const now = new Date().toISOString();
    setState((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        updatedAt: now,
        loreEntries: [entry, ...current.loreEntries]
      };
    });
  }, []);

  const resetWorkspace = useCallback(async () => {
    const empty = createEmptyWorkspaceState();
    setState(empty);
    writeLocalWorkspace(empty);
    await persistWorkspace(empty);
  }, []);

  const value = useMemo<WorkspaceContextValue | null>(() => {
    if (!state) {
      return null;
    }

    return {
      isReady,
      isSaving,
      saveError,
      state,
      createUniverse,
      createStory,
      updateStoryDraft,
      addLoreEntry,
      resetWorkspace
    };
  }, [state, isReady, isSaving, saveError, createUniverse, createStory, updateStoryDraft, addLoreEntry, resetWorkspace]);

  if (!value) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--muted)]">
        Loading your workspace...
      </div>
    );
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return context;
}

export function useWorkspaceLoreActions(story: Story) {
  const { addLoreEntry } = useWorkspace();

  return {
    createFromSelection(input: {
      type: LoreEntryType;
      name: string;
      description: string;
      excerpt: string;
      chapterTitle: string;
      sceneTitle: string;
    }) {
      const entry = createLoreEntryDraft({
        userId: story.userId,
        universeId: story.universeId,
        type: input.type,
        name: input.name,
        shortSummary: input.description,
        fullDescription: input.description,
        source: {
          storyTitle: story.title,
          chapterTitle: input.chapterTitle,
          sceneTitle: input.sceneTitle,
          excerpt: input.excerpt
        }
      });
      addLoreEntry(entry);
      return entry;
    }
  };
}
