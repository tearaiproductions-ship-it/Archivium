"use client";

import Link from "next/link";
import { use } from "react";

import { WritingEditor } from "@/components/writing/writing-editor";
import { useWorkspace } from "@/components/workspace/workspace-provider";

export function WriteStoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = use(params);
  const { state, isReady } = useWorkspace();

  if (!isReady) {
    return <p className="text-sm text-[var(--muted)]">Loading story…</p>;
  }

  const story = state.stories.find((candidate) => candidate.id === storyId);

  if (!story) {
    return (
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">
        <h1 className="text-2xl font-semibold">Story not found</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          This story id is not in your workspace yet. Create a story first, then open it from the Stories list.
        </p>
        <Link href="/app/stories" className="mt-6 inline-flex rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white">
          Go to Stories
        </Link>
      </section>
    );
  }

  const chapter =
    state.chapters.find((item) => item.storyId === story.id && item.sortOrder === 1) ?? state.chapters.find((item) => item.storyId === story.id);
  const scene =
    (chapter && state.scenes.find((item) => item.chapterId === chapter.id && item.sortOrder === 1)) ||
    (chapter && state.scenes.find((item) => item.chapterId === chapter.id));

  const initialBody = state.storyDrafts[story.id] ?? scene?.body ?? "";

  const loreEntries = state.loreEntries.filter((entry) => entry.universeId === story.universeId);

  return (
    <WritingEditor
      story={story}
      chapterTitle={chapter?.title ?? "Chapter 1"}
      sceneTitle={scene?.title ?? "Opening Scene"}
      initialBody={initialBody}
      initialLoreEntries={loreEntries}
    />
  );
}
