"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";

import { useWorkspace } from "@/components/workspace/workspace-provider";

export function UniverseManager() {
  const { state, createUniverse, isSaving, saveError } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const sortedUniverses = useMemo(
    () => [...state.universes].sort((a, b) => a.name.localeCompare(b.name)),
    [state.universes]
  );

  function handleCreateUniverse() {
    const created = createUniverse(name, description);
    if (!created) {
      setMessage("Enter a universe name to continue.");
      return;
    }

    setName("");
    setDescription("");
    setMessage(`Created “${created.name}”. You can now attach stories to this universe.`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Create universe</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Start a fresh encyclopedia</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          A universe is the top-level container for characters, places, timelines, systems, and linked stories.
        </p>
        <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Test mode: you can create unlimited universes here. Changes save automatically{isSaving ? " (saving…)" : ""}.
        </div>
        {saveError ? <p className="mt-3 text-sm text-red-600">{saveError}</p> : null}
        {message ? (
          <p className="mt-3 flex items-start gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            {message}
          </p>
        ) : null}
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleCreateUniverse();
          }}
        >
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
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus className="size-4" />
            Create universe
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Your universes ({sortedUniverses.length})</h2>
        {sortedUniverses.length === 0 ? (
          <p className="mt-5 text-sm text-[var(--muted)]">No universes yet. Create your first one on the left.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {sortedUniverses.map((universe) => (
              <article key={universe.id} className="rounded-2xl border border-[var(--border)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Private</p>
                <h3 className="mt-2 text-lg font-semibold">{universe.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{universe.description || "No description yet."}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
