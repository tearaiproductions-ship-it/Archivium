import Link from "next/link";
import { ArrowRight, BookOpen, Database, Layers3, PenLine } from "lucide-react";

const pillars = [
  {
    icon: Database,
    title: "Universes",
    description: "Top-level lore databases for characters, locations, factions, magic systems, timelines, and glossary terms."
  },
  {
    icon: BookOpen,
    title: "Stories",
    description: "Chapters and scenes linked to the same encyclopedia — or start a brand-new universe during setup."
  },
  {
    icon: PenLine,
    title: "Writing studio",
    description: "Mobile-first editor with autosave, word count, highlight-to-lore, and a collapsible lore sidebar."
  },
  {
    icon: Layers3,
    title: "Continuity layer",
    description: "Track first mentions, appearances, unresolved mentions, duplicates, and manual timeline order."
  }
];

export function ProductShowcase() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto w-full max-w-[90rem] px-6 py-16 sm:px-10 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Product scope</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            One platform for drafting, encyclopedias, and canon — not a cramped widget.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            LoreWrite is built for authors managing long-form fiction and living worlds. The workspace spans dashboards,
            universe management, story lists, a full writing surface, encyclopedia views, timelines, and exports.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
              <pillar.icon className="size-7 text-[var(--accent)]" />
              <h3 className="mt-4 text-xl font-semibold">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{pillar.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--background)] shadow-2xl shadow-black/10">
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
            <span className="ml-4 text-sm text-[var(--muted)]">LoreWrite — Writing + Encyclopedia</span>
          </div>
          <div className="grid min-h-[28rem] lg:grid-cols-[14rem_1fr_20rem]">
            <aside className="hidden border-r border-[var(--border)] p-5 lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Navigation</p>
              <ul className="mt-4 space-y-2 text-sm font-medium">
                {["Dashboard", "Universes", "Stories", "Encyclopedia", "Timeline", "Settings"].map((item) => (
                  <li key={item} className="rounded-xl px-3 py-2 text-[var(--muted)]">
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
            <div className="border-r border-[var(--border)] p-6 lg:p-10">
              <p className="text-sm text-[var(--muted)]">The Ember Road · Chapter 1 · Opening Scene</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight">Writing surface</h3>
              <p className="writing-surface mt-8 text-2xl leading-10">
                Mara crossed the <mark className="rounded-lg bg-amber-200/80 px-1.5 py-0.5">Black Glass Bridge</mark> before
                the bells woke the harbor. Below, ash boats moved like ghosts through the red fog.
              </p>
              <p className="mt-6 text-sm text-[var(--muted)]">12,842 words · Autosaved · Highlight text to create lore</p>
            </div>
            <aside className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Lore sidebar</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <p className="text-xs text-[var(--accent)]">Location</p>
                  <p className="mt-1 font-semibold">Black Glass Bridge</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">First mentioned · Chapter 1</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <p className="text-xs text-[var(--accent)]">Character</p>
                  <p className="mt-1 font-semibold">Mara Vel</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">Linked · 2 appearances</p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 text-base font-semibold text-white"
          >
            Open the full app
            <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/app/stories"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-8 py-4 text-base font-semibold"
          >
            Go to Stories
          </Link>
        </div>
      </div>
    </section>
  );
}
