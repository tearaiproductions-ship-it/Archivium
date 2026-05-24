"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookPlus, CheckCircle2, ChevronRight } from "lucide-react";

import { useWorkspace } from "@/components/workspace/workspace-provider";

type StoryUniverseMode = "existing" | "new";

export function StoryManager() {
  const { state, createStory, isSaving, saveError } = useWorkspace();
  const [mode, setMode] = useState<StoryUniverseMode>("existing");
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [universeId, setUniverseId] = useState("");
  const [newUniverseName, setNewUniverseName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const universes = state.universes;
  const stories = state.stories;

  useEffect(() => {
    if (!universeId && universes[0]) {
      setUniverseId(universes[0].id);
    }
  }, [universeId, universes]);

  useEffect(() => {
    if (universes.length === 0) {
      setMode("new");
    }
  }, [universes.length]);

  const universeById = useMemo(() => new Map(universes.map((universe) => [universe.id, universe])), [universes]);

  function handleCreateStory() {
    const created = createStory({
      title,
      synopsis,
      mode,
      universeId: mode === "existing" ? universeId : undefined,
      newUniverseName
    });

    if (!created) {
      setMessage(
        mode === "existing" && universes.length === 0
          ? "Create a universe first, or switch to “Create new universe”."
          : "Enter a story title to continue."
      );
      return;
    }

    setTitle("");
    setSynopsis("");
    setNewUniverseName("");
    setMessage(`Created “${created.title}”. Open it below to start writing.`);
    setMode(universes.length > 0 ? "existing" : "new");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Create story</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Choose its universe first</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Stories can extend an existing encyclopedia or create a fresh universe database during setup.
        </p>
        {saveError ? <p className="mt-3 text-sm text-red-600">{saveError}</p> : null}
        {message ? (
          <p className="mt-3 flex items-start gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            {message}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(["existing", "new"] as StoryUniverseMode[]).map((option) => (
            <button
              key={option}
              type="button"
              disabled={option === "existing" && universes.length === 0}
              onClick={() => setMode(option)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold disabled:opacity-50 ${
                mode === option
                  ? "border-[var(--accent)] bg-[var(--background)] text-[var(--accent)]"
                  : "border-[var(--border)]"
              }`}
            >
              {option === "existing" ? "Use existing universe" : "Create new universe"}
            </button>
          ))}
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleCreateStory();
          }}
        >
          <label className="block">
            <span className="text-sm font-medium">Story title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="The Ember Road"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Synopsis</span>
            <textarea
              value={synopsis}
              onChange={(event) => setSynopsis(event.target.value)}
              rows={4}
              placeholder="A short working summary for this draft."
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
            />
          </label>
          {mode === "existing" ? (
            <label className="block">
              <span className="text-sm font-medium">Universe</span>
              <select
                value={universeId}
                onChange={(event) => setUniverseId(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 outline-none focus:border-[var(--accent)]"
              >
                {universes.length === 0 ? <option value="">No universes yet</option> : null}
                {universes.map((universe) => (
                  <option key={universe.id} value={universe.id}>
                    {universe.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="block">
              <span className="text-sm font-medium">New universe name</span>
              <input
                value={newUniverseName}
                onChange={(event) => setNewUniverseName(event.target.value)}
                placeholder="Ashfall Universe"
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
              />
            </label>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
          >
            <BookPlus className="size-4" />
            Create story {isSaving ? "(saving…)" : ""}
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Stories ({stories.length})</h2>
        {stories.length === 0 ? (
          <p className="mt-5 text-sm text-[var(--muted)]">No stories yet. Create one to open the writing editor.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/app/write/${story.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] p-4 transition hover:border-[var(--accent)]"
              >
                <div>
                  <h3 className="font-semibold">{story.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {universeById.get(story.universeId)?.name ?? "Unknown universe"} · {story.wordCount} words
                  </p>
                </div>
                <ChevronRight className="size-5 text-[var(--muted)]" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
