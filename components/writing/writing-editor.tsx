"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Database, Link2, Menu, Plus, Save, Search, StickyNote, X } from "lucide-react";

import { loreEntryTypes } from "@/lib/database/lore-entry-types";
import { searchLoreEntries } from "@/lib/services/lore-service";
import type { LoreEntry, LoreEntryType, Story } from "@/lib/types/domain";
import { countWords } from "@/lib/utils";
import { useWorkspace, useWorkspaceLoreActions } from "@/components/workspace/workspace-provider";

export function WritingEditor({
  story,
  chapterTitle,
  sceneTitle,
  initialBody,
  initialLoreEntries
}: {
  story: Story;
  chapterTitle: string;
  sceneTitle: string;
  initialBody: string;
  initialLoreEntries: LoreEntry[];
}) {
  const { updateStoryDraft, isSaving, state } = useWorkspace();
  const loreActions = useWorkspaceLoreActions(story);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [body, setBody] = useState(initialBody);
  const [selectedText, setSelectedText] = useState("");
  const [entryType, setEntryType] = useState<LoreEntryType>("character");
  const [entryDescription, setEntryDescription] = useState("");
  const [loreQuery, setLoreQuery] = useState("");
  const [isLoreOpen, setIsLoreOpen] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");

  const loreEntries = useMemo(
    () => state.loreEntries.filter((entry) => entry.universeId === story.universeId),
    [state.loreEntries, story.universeId]
  );

  const visibleLoreEntries = useMemo(
    () => searchLoreEntries(loreEntries.length ? loreEntries : initialLoreEntries, loreQuery, story.universeId),
    [loreEntries, initialLoreEntries, loreQuery, story.universeId]
  );

  const storyWordCount = countWords(body);

  useEffect(() => {
    setSaveState("saving");
    const timeout = window.setTimeout(() => {
      updateStoryDraft(story.id, body);
      setSaveState("saved");
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [body, story.id, updateStoryDraft]);

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

    loreActions.createFromSelection({
      type: entryType,
      name: selectedText,
      description: entryDescription,
      excerpt: buildExcerpt(body, selectedText),
      chapterTitle,
      sceneTitle
    });

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
            <p className="text-sm text-[var(--muted)]">
              {chapterTitle} · {sceneTitle}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{story.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-[var(--background)] px-3 py-2">{storyWordCount} words</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--background)] px-3 py-2 text-[var(--muted)]">
              <Save className="size-4" />
              {saveState === "saving" || isSaving ? "Autosaving" : "Autosaved"}
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
  const panelClassName = [
    "rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-4 lg:sticky lg:top-6 lg:block lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto",
    isOpen ? "fixed inset-x-4 bottom-4 z-40 max-h-[75vh] overflow-y-auto shadow-2xl lg:static lg:inset-auto lg:shadow-none" : "hidden"
  ].join(" ");

  return (
    <aside className={panelClassName}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="size-5 text-[var(--accent)]" />
          <h2 className="font-semibold">Lore sidebar</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-[var(--border)] p-2 lg:hidden">
          <X className="size-4" />
        </button>
      </div>

      <label className="relative mb-4 block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
        <input
          value={loreQuery}
          onChange={(event) => onLoreQueryChange(event.target.value)}
          placeholder="Search encyclopedia"
          className="w-full rounded-2xl border border-[var(--border)] bg-transparent py-3 pl-10 pr-3 text-sm outline-none focus:border-[var(--accent)]"
        />
      </label>

      {selectedText ? (
        <div className="mb-4 rounded-2xl bg-[var(--background)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Create from selection</p>
          <p className="mt-2 text-sm font-semibold">{selectedText}</p>
          <select
            value={entryType}
            onChange={(event) => onEntryTypeChange(event.target.value as LoreEntryType)}
            className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
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
            placeholder="Optional description"
            className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            type="button"
            onClick={onCreateLoreEntry}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
          >
            <Plus className="size-4" />
            Save lore entry
          </button>
        </div>
      ) : (
        <p className="mb-4 text-sm text-[var(--muted)]">Highlight text in the editor to create or link lore entries.</p>
      )}

      <div className="space-y-3">
        {loreEntries.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No lore entries in this universe yet.</p>
        ) : (
          loreEntries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-[var(--border)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{entry.type}</p>
              <h3 className="mt-1 font-semibold">{entry.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{entry.shortSummary || "No summary yet."}</p>
            </article>
          ))
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
        <BookOpen className="mb-2 size-5 text-[var(--accent)]" />
        Lore sidebar placeholder is active. Entries you create here sync to the encyclopedia and workspace storage.
      </div>
    </aside>
  );
}

function buildExcerpt(body: string, selectedText: string) {
  const index = body.toLowerCase().indexOf(selectedText.toLowerCase());
  if (index === -1) {
    return selectedText;
  }

  const start = Math.max(0, index - 60);
  const end = Math.min(body.length, index + selectedText.length + 60);
  return body.slice(start, end).trim();
}
