"use client";

import { useState } from "react";
import { Download, Moon, RefreshCcw, Shield, Sparkles, Users } from "lucide-react";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { createDefaultWorkspaceState } from "@/lib/workspace/default-state";

const settings = [
  {
    icon: Shield,
    title: "Private workspace",
    description: "All records are user-scoped in the schema with row-level security policies."
  },
  {
    icon: Users,
    title: "Collaboration-ready",
    description: "Sharing, co-authors, and public encyclopedia pages can be layered onto universe permissions later."
  },
  {
    icon: Sparkles,
    title: "AI-ready service layer",
    description: "Lore, timeline, continuity, and export logic is isolated for future AI suggestions and checks."
  },
  {
    icon: Download,
    title: "Export options",
    description: "Story manuscripts, chapters, encyclopedia data, character/location lists, CSV, and JSON are modeled."
  }
];

export function SettingsClient() {
  const { resetWorkspace, state } = useWorkspace();
  const [status, setStatus] = useState<string | null>(null);

  async function handleResetDemo() {
    const demo = createDefaultWorkspaceState();
    setStatus("Restoring demo sample data…");
    await fetch("/api/workspace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(demo)
    });
    window.location.reload();
  }

  async function handleClearAll() {
    await resetWorkspace();
    setStatus("Workspace cleared. Create a fresh universe and story to test.");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Account settings</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Workspace controls</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Test mode stores your universes, stories, and lore on this server so they survive page reloads.
        </p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Current workspace: {state.universes.length} universes, {state.stories.length} stories, {state.loreEntries.length}{" "}
          lore entries.
        </p>
        {status ? <p className="mt-3 text-sm text-emerald-700">{status}</p> : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold"
          >
            <RefreshCcw className="size-4" />
            Restore demo sample data
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
          >
            Clear workspace
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {settings.map((setting) => (
          <article key={setting.title} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
            <setting.icon className="size-6 text-[var(--accent)]" />
            <h2 className="mt-4 text-lg font-semibold">{setting.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{setting.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-start gap-3">
          <Moon className="mt-1 size-5 text-[var(--accent)]" />
          <div>
            <h2 className="font-semibold">Dark mode ready</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              The design system uses CSS variables for light and dark palettes. A persistent theme toggle can be added
              here when user preferences are stored in Supabase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
