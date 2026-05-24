"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Plus } from "lucide-react";

import { detectTimelineGaps, sortTimelineEvents } from "@/lib/services/timeline-service";
import type { TimelineEvent, Universe } from "@/lib/types/domain";
import { slugify } from "@/lib/utils";

export function TimelineView({ universes }: { universes: Universe[] }) {
  const [universeId, setUniverseId] = useState(universes[0]?.id ?? "");
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "third-ashfall",
      userId: "demo-user",
      universeId: "ashfall-universe",
      title: "Third Ashfall",
      description: "The latest eruption changes the city trade routes.",
      dateLabel: "Year 318",
      sortOrder: 10,
      linkedEntryIds: ["black-glass-bridge"]
    },
    {
      id: "bridge-crossing",
      userId: "demo-user",
      universeId: "ashfall-universe",
      title: "Mara crosses the bridge",
      description: "Opening scene of The Ember Road.",
      dateLabel: "Year 318, early thaw",
      sortOrder: 20,
      linkedEntryIds: ["mara-vel", "black-glass-bridge"]
    }
  ]);
  const [title, setTitle] = useState("");
  const [dateLabel, setDateLabel] = useState("");

  const visibleEvents = useMemo(
    () => sortTimelineEvents(events.filter((event) => event.universeId === universeId)),
    [events, universeId]
  );
  const gaps = useMemo(() => detectTimelineGaps(visibleEvents), [visibleEvents]);

  function handleCreateEvent() {
    if (!title.trim()) {
      return;
    }

    setEvents((current) => [
      ...current,
      {
        id: slugify(title) || `event-${Date.now()}`,
        userId: "demo-user",
        universeId,
        title: title.trim(),
        description: "Manual timeline checkpoint.",
        dateLabel: dateLabel.trim(),
        sortOrder: current.length * 10 + 10,
        linkedEntryIds: []
      }
    ]);
    setTitle("");
    setDateLabel("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Timeline</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Manual continuity order</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Version 1 keeps timeline checks deliberate and author-controlled while preserving the structure needed for
          future contradiction detection.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Universe</span>
            <select
              value={universeId}
              onChange={(event) => setUniverseId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
            >
              {universes.map((universe) => (
                <option key={universe.id} value={universe.id}>
                  {universe.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Event title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Coronation of the Ash Queen"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Date or order label</span>
            <input
              value={dateLabel}
              onChange={(event) => setDateLabel(event.target.value)}
              placeholder="Year 318"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <button
            type="button"
            onClick={handleCreateEvent}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus className="size-4" />
            Add timeline event
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-xl font-semibold">Events</h2>
        {gaps.length ? (
          <div className="mt-4 rounded-2xl bg-amber-100 p-4 text-sm text-amber-900">
            <div className="flex gap-2">
              <AlertCircle className="size-5" />
              <p>{gaps[0]?.message}</p>
            </div>
          </div>
        ) : null}
        <div className="mt-5 space-y-4">
          {visibleEvents.map((event) => (
            <article key={event.id} className="rounded-2xl border border-[var(--border)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                {event.dateLabel || "No date label"}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{event.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
