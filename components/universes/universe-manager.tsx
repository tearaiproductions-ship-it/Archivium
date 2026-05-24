"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import type { Universe } from "@/lib/types/domain";
import { slugify } from "@/lib/utils";

export function UniverseManager({ initialUniverses }: { initialUniverses: Universe[] }) {
  const [universes, setUniverses] = useState(initialUniverses);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const freeTierLimitReached = universes.length >= 1;

  useEffect(() => {
    const saved = window.localStorage.getItem("lorewrite:universes");
    if (saved) {
      setUniverses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("lorewrite:universes", JSON.stringify(universes));
  }, [universes]);

  const sortedUniverses = useMemo(
    () => [...universes].sort((a, b) => a.name.localeCompare(b.name)),
    [universes]
  );

  function handleCreateUniverse() {
    if (!name.trim()) {
      return;
    }

    const now = new Date().toISOString();
    const nextUniverse: Universe = {
      id: slugify(name) || `universe-${Date.now()}`,
      userId: "demo-user",
      name: name.trim(),
      description: description.trim(),
      createdAt: now,
      updatedAt: now
    };

    setUniverses((current) => [nextUniverse, ...current]);
    setName("");
    setDescription("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Create universe</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Start a fresh encyclopedia</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          A universe is the top-level container for characters, places, timelines, systems, and linked stories.
        </p>
        {freeTierLimitReached ? (
          <div className="mt-5 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
            Free tier placeholder: production billing can limit users to one universe and show an upgrade prompt here.
          </div>
        ) : null}
        <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
          <label className="block">
            <span className="text-sm font-medium">Universe name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="The Kingdom Cycle"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="What kind of world is this?"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <button
            type="button"
            onClick={handleCreateUniverse}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus className="size-4" />
            Create universe
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Your universes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {sortedUniverses.map((universe) => (
            <article key={universe.id} className="rounded-2xl border border-[var(--border)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Private</p>
              <h3 className="mt-2 text-lg font-semibold">{universe.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{universe.description || "No description yet."}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
