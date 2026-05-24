"use client";

import { useMemo, useState } from "react";
import { Download, Network, Search } from "lucide-react";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { loreEntryTypes, getLoreEntryTypeLabel } from "@/lib/database/lore-entry-types";
import { exportLoreCsv, exportUniverseJson } from "@/lib/services/export-service";
import { searchLoreEntries } from "@/lib/services/lore-service";
import type { LoreEntryType } from "@/lib/types/domain";

const allTypes = ["all", ...loreEntryTypes.map((type) => type.value)] as const;
type FilterType = (typeof allTypes)[number];

export function EncyclopediaDashboard() {
  const { state } = useWorkspace();
  const universes = state.universes;
  const entries = state.loreEntries;

  const [query, setQuery] = useState("");
  const [type, setType] = useState<FilterType>("all");
  const [universeId, setUniverseId] = useState(universes[0]?.id ?? "");

  const activeUniverseId = universeId || universes[0]?.id || "";

  const filteredEntries = useMemo(() => {
    const searched = searchLoreEntries(entries, query, activeUniverseId);
    return type === "all" ? searched : searched.filter((entry) => entry.type === type);
  }, [entries, query, type, activeUniverseId]);

  const selectedUniverse = universes.find((universe) => universe.id === activeUniverseId) ?? universes[0];

  function download(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Universe encyclopedia</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Lore database</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Browse, filter, export, and prepare entries for relationship and continuity views.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                selectedUniverse &&
                download("lorewrite-encyclopedia.json", exportUniverseJson(selectedUniverse, filteredEntries), "application/json")
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold"
            >
              <Download className="size-4" />
              JSON
            </button>
            <button
              type="button"
              onClick={() => download("lorewrite-lore.csv", exportLoreCsv(filteredEntries), "text/csv")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
            >
              <Download className="size-4" />
              CSV
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_14rem_14rem]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search names, summaries, or tags"
              className="w-full rounded-2xl border border-[var(--border)] bg-transparent py-3 pl-11 pr-4 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <select
            value={activeUniverseId}
            onChange={(event) => setUniverseId(event.target.value)}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
          >
            {universes.map((universe) => (
              <option key={universe.id} value={universe.id}>
                {universe.name}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as FilterType)}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
          >
            {allTypes.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All types" : getLoreEntryTypeLabel(option as LoreEntryType)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredEntries.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No lore entries yet. Create some from the writing editor.</p>
        ) : (
          filteredEntries.map((entry) => (
            <article key={entry.id} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    {getLoreEntryTypeLabel(entry.type)}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{entry.name}</h2>
                </div>
                <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-semibold capitalize">
                  {entry.canonStatus}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{entry.shortSummary || "No summary yet."}</p>
              {entry.firstMention ? (
                <p className="mt-4 text-xs text-[var(--muted)]">
                  First mentioned in {entry.firstMention.storyTitle} / {entry.firstMention.chapterTitle}
                </p>
              ) : null}
            </article>
          ))
        )}
      </section>

      <section className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center gap-3">
          <Network className="size-6 text-[var(--accent)]" />
          <div>
            <h2 className="font-semibold">Relationship map placeholder</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Linked entries and relationship edges are modeled in the schema for a future graph view.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
