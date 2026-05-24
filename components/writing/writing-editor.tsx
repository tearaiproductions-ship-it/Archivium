"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Database, Link2, Menu, Plus, Save, Search, StickyNote, X } from "lucide-react";

import { loreEntryTypes } from "@/lib/database/lore-entry-types";
import { createLoreEntryDraft, searchLoreEntries } from "@/lib/services/lore-service";
import type { LoreEntry, LoreEntryType, Story } from "@/lib/types/domain";
import { countWords } from "@/lib/utils";

const initialDraft =
  "Mara crossed the Black Glass Bridge before the bells woke the harbor.\n\nBelow, ash boats moved like ghosts through the red fog. Somewhere beyond the caldera, the Ash Court had already decided who would be blamed.";

export function WritingEditor({
  story,
  initialLoreEntries
}: {
  story: Story;
  initialLoreEntries: LoreEntry[];
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [body, setBody] = useState(initialDraft);
  const [selectedText, setSelectedText] = useState("");
  const [entryType, setEntryType] = useState<LoreEntryType>("character");
  const [entryDescription, setEntryDescription] = useState("");
  const [loreEntries, setLoreEntries] = useState(initialLoreEntries);
  const [loreQuery, setLoreQuery] = useState("");
  const [isLoreOpen, setIsLoreOpen] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");

  const storageKey = `lorewrite:draft:${story.id}`;

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(storageKey);
    if (savedDraft) {
      setBody(savedDraft);
    }

    const savedLore = window.localStorage.getItem("lorewrite:loreEntries");
    if (savedLore) {
      setLoreEntries(JSON.parse(savedLore));
    }
  }, [storageKey]);

  useEffect(() => {
    setSaveState("saving");
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, body);
      setSaveState("saved");
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [body, storageKey]);

  useEffect(() => {
    window.localStorage.setItem("lorewrite:loreEntries", JSON.stringify(loreEntries));
  }, [loreEntries]);

  const visibleLoreEntries = useMemo(
    () => searchLoreEntries(loreEntries, loreQuery, story.universeId),
    [loreEntries, loreQuery, story.universeId]
  );

  const storyWordCount = countWords(body);

  function captureSelection() {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const selection = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd).trim();
    setSelectedText(selection);
    if (selection) {
      setIsLoreOpen(true);
    }
  }

  function handleCreateLoreEntry() {
    if (!selectedText) {
      return;
    }

    const nextEntry = createLoreEntryDraft({
      userId: story.userId,
      universeId: story.universeId,
      type: entryType,
      name: selectedText,
      shortSummary: entryDescription,
      fullDescription: entryDescription,
      source: {
        storyTitle: story.title,
        chapterTitle: "Chapter 1",
        sceneTitle: "Opening Scene",
        excerpt: buildExcerpt(body, selectedText)
      }
    });

    setLoreEntries((current) => [nextEntry, ...current]);
    setEntryDescription("");
    setSelectedText("");
  }

  function handleAddUnresolvedNote() {
    if (!selectedText) {
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const before = body.slice(0, textarea.selectionStart);
    const after = body.slice(textarea.selectionEnd);
    setBody(`${before}[[${selectedText}?]]${after}`);
    setSelectedText("");
  }

  return (
    <div className="grid min-h-[calc(100vh-5rem)] gap-5 lg:grid-cols-[1fr_23rem]">
      <section className="flex min-h-[70vh] flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)]">
        <header className="flex flex-col gap-4 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">Chapter 1 · Opening Scene</p>
            <h1 className="text-2xl font-semibold tracking-tight">{story.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-[var(--background)] px-3 py-2">{storyWordCount} words</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--background)] px-3 py-2 text-[var(--muted)]">
              <Save className="size-4" />
              {saveState === "saving" ? "Autosaving" : "Autosaved"}
            </span>
            <button
              type="button"
              onClick={() => setIsLoreOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 font-semibold lg:hidden"
            >
              <Menu className="size-4" />
              Lore
            </button>
          </div>
        </header>

        {selectedText ? (
          <div className="flex flex-wrap gap-2 border-b border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <span className="rounded-full bg-[var(--card)] px-3 py-2 text-sm">
              Selected: <strong>{selectedText}</strong>
            </span>
            <button
              type="button"
              onClick={handleCreateLoreEntry}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
            >
              <Plus className="size-4" />
              Create lore
            </button>
            <button
              type="button"
              onClick={() => setLoreQuery(selectedText)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-sm font-semibold"
            >
              <Link2 className="size-4" />
              Link existing
            </button>
            <button
              type="button"
              onClick={handleAddUnresolvedNote}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-sm font-semibold"
            >
              <StickyNote className="size-4" />
              Add note
            </button>
          </div>
        ) : null}

        <textarea
          ref={textareaRef}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onSelect={captureSelection}
          className="writing-surface min-h-[58vh] flex-1 resize-none rounded-b-[2rem] bg-transparent p-5 text-xl leading-9 outline-none sm:p-8"
          placeholder="Begin the scene..."
        />
      </section>

      <LorePanel
        selectedText={selectedText}
        entryType={entryType}
        entryDescription={entryDescription}
        loreQuery={loreQuery}
        loreEntries={visibleLoreEntries}
        isOpen={isLoreOpen}
        onClose={() => setIsLoreOpen(false)}
        onEntryTypeChange={setEntryType}
        onEntryDescriptionChange={setEntryDescription}
        onLoreQueryChange={setLoreQuery}
        onCreateLoreEntry={handleCreateLoreEntry}
      />
    </div>
  );
}

function LorePanel({
  selectedText,
  entryType,
  entryDescription,
  loreQuery,
  loreEntries,
  isOpen,
  onClose,
  onEntryTypeChange,
  onEntryDescriptionChange,
  onLoreQueryChange,
  onCreateLoreEntry
}: {
  selectedText: string;
  entryType: LoreEntryType;
  entryDescription: string;
  loreQuery: string;
  loreEntries: LoreEntry[];
  isOpen: boolean;
  onClose: () => void;
  onEntryTypeChange: (value: LoreEntryType) => void;
  onEntryDescriptionChange: (value: string) => void;
  onLoreQueryChange: (value: string) => void;
  onCreateLoreEntry: () => void;
}) {
  return (
    <aside
      className={`fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-y-auto rounded-t-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl transition lg:static lg:max-h-none lg:rounded-[2rem] lg:shadow-none ${
        isOpen ? "translate-y-0" : "translate-y-[calc(100%+2rem)] lg:translate-y-0"
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Lore drawer</p>
          <h2 className="mt-1 text-xl font-semibold">Encyclopedia</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-[var(--border)] p-2 lg:hidden">
          <X className="size-4" />
        </button>
      </div>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
        <input
          value={loreQuery}
          onChange={(event) => onLoreQueryChange(event.target.value)}
          placeholder="Search existing lore"
          className="w-full rounded-2xl border border-[var(--border)] bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-[var(--accent)]"
        />
      </label>

      <section className="mt-5 rounded-3xl bg-[var(--background)] p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-[var(--accent)]" />
          <h3 className="font-semibold">Create from selection</h3>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {selectedText ? `"${selectedText}" will be saved with this story, chapter, and scene as first mention.` : "Highlight text in the editor to create or link lore."}
        </p>
        <div className="mt-4 space-y-3">
          <select
            value={entryType}
            onChange={(event) => onEntryTypeChange(event.target.value as LoreEntryType)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm"
          >
            {loreEntryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <textarea
            value={entryDescription}
            onChange={(event) => onEntryDescriptionChange(event.target.value)}
            rows={3}
            placeholder="Optional description or note"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
          <button
            type="button"
            disabled={!selectedText}
            onClick={onCreateLoreEntry}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Database className="size-4" />
            Save lore entry
          </button>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        {loreEntries.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-[var(--border)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{entry.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{entry.type}</p>
              </div>
              <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs capitalize">{entry.canonStatus}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{entry.shortSummary || "No summary yet."}</p>
          </article>
        ))}
      </section>
    </aside>
  );
}

function buildExcerpt(body: string, selectedText: string) {
  const index = body.indexOf(selectedText);
  if (index < 0) {
    return selectedText;
  }

  return body.slice(Math.max(0, index - 80), Math.min(body.length, index + selectedText.length + 80)).trim();
}
