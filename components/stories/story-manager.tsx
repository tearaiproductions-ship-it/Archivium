"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookPlus, ChevronRight } from "lucide-react";

import type { Story, Universe } from "@/lib/types/domain";
import { slugify } from "@/lib/utils";

type StoryUniverseMode = "existing" | "new";

export function StoryManager({
  initialStories,
  initialUniverses
}: {
  initialStories: Story[];
  initialUniverses: Universe[];
}) {
  const [stories, setStories] = useState(initialStories);
  const [universes, setUniverses] = useState(initialUniverses);
  const [mode, setMode] = useState<StoryUniverseMode>("existing");
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [universeId, setUniverseId] = useState(initialUniverses[0]?.id ?? "");
  const [newUniverseName, setNewUniverseName] = useState("");

  useEffect(() => {
    const savedStories = window.localStorage.getItem("lorewrite:stories");
    const savedUniverses = window.localStorage.getItem("lorewrite:universes");
    if (savedStories) setStories(JSON.parse(savedStories));
    if (savedUniverses) setUniverses(JSON.parse(savedUniverses));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("lorewrite:stories", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    window.localStorage.setItem("lorewrite:universes", JSON.stringify(universes));
  }, [universes]);

  const universeById = useMemo(() => new Map(universes.map((universe) => [universe.id, universe])), [universes]);

  function handleCreateStory() {
    if (!title.trim()) {
      return;
    }

    const now = new Date().toISOString();
    let selectedUniverseId = universeId;

    if (mode === "new") {
      const universeName = newUniverseName.trim() || `${title.trim()} Universe`;
      const newUniverse: Universe = {
        id: slugify(universeName) || `universe-${Date.now()}`,
        userId: "demo-user",
        name: universeName,
        description: `Lore database for ${title.trim()}.`,
        createdAt: now,
        updatedAt: now
      };

      selectedUniverseId = newUniverse.id;
      setUniverses((current) => [newUniverse, ...current]);
      setUniverseId(newUniverse.id);
    }

    const nextStory: Story = {
      id: slugify(title) || `story-${Date.now()}`,
      userId: "demo-user",
      universeId: selectedUniverseId,
      title: title.trim(),
      synopsis: synopsis.trim(),
      draftStatus: "planning",
      wordCount: 0,
      createdAt: now,
      updatedAt: now
    };

    setStories((current) => [nextStory, ...current]);
    setTitle("");
    setSynopsis("");
    setNewUniverseName("");
    setMode("existing");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Create story</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Choose its universe first</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Stories can extend an existing encyclopedia or create a fresh universe database during setup.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(["existing", "new"] as StoryUniverseMode[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${
                mode === option
                  ? "border-[var(--accent)] bg-[var(--background)] text-[var(--accent)]"
                  : "border-[var(--border)]"
              }`}
            >
              {option === "existing" ? "Use existing universe" : "Create new universe"}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
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
            type="button"
            onClick={handleCreateStory}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
          >
            <BookPlus className="size-4" />
            Create story
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Stories</h2>
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
      </section>
    </div>
  );
}
