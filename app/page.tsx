import Link from "next/link";
import { BookOpen, Database, FileDown, GitBranch, PenLine, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";

const features = [
  {
    icon: PenLine,
    title: "Write and worldbuild together",
    description: "Draft chapters while capturing characters, locations, factions, items, and events as structured lore."
  },
  {
    icon: Database,
    title: "Universe-first organization",
    description: "Keep multiple stories connected to one private encyclopedia, or start fresh for each new setting."
  },
  {
    icon: GitBranch,
    title: "Continuity helper",
    description: "Track appearances, first mentions, duplicate entries, unresolved mentions, and manual timeline checks."
  },
  {
    icon: FileDown,
    title: "Author-owned exports",
    description: "Export manuscripts, chapters, character lists, location lists, encyclopedias, CSV, and JSON."
  }
];

export default function LandingPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="flex flex-col justify-center">
          <p className="mb-5 inline-flex w-fit rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)]">
            Serious writing software for living worlds
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Draft the story. Build the encyclopedia. Keep the canon aligned.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            LoreWrite gives independent authors and worldbuilders a calm writing space connected to a structured,
            private lore database for every universe they create.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-center text-sm font-semibold text-white shadow-sm"
            >
              Start writing
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-center text-sm font-semibold"
            >
              Sign in with Supabase
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl shadow-black/5">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 p-4 dark:bg-white/5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">The Ember Road</p>
                <h2 className="text-xl font-semibold">Chapter 1: Cinders</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Autosaved
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
              <article className="writing-surface min-h-80 rounded-3xl bg-[var(--card)] p-6 text-xl leading-9">
                Mara crossed the <mark className="rounded bg-amber-200/70 px-1">Black Glass Bridge</mark> before
                the bells woke the harbor. Below, ash boats moved like ghosts through the red fog.
              </article>
              <aside className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Lore</p>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-[var(--card)] p-3">
                    <p className="text-sm font-semibold">Black Glass Bridge</p>
                    <p className="text-xs text-[var(--muted)]">Location · first mentioned here</p>
                  </div>
                  <button className="w-full rounded-2xl border border-dashed border-[var(--accent)] px-3 py-3 text-sm font-semibold text-[var(--accent)]">
                    Create lore from selection
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto grid w-full max-w-7xl gap-4 px-5 py-10 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
            <feature.icon className="mb-4 size-6 text-[var(--accent)]" />
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{feature.description}</p>
          </div>
        ))}
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8">
          <ShieldCheck className="mb-4 size-8 text-[var(--accent)]" />
          <h2 className="text-3xl font-semibold">Pricing-ready from day one</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Version 1 keeps workspaces private and includes placeholders for Free, Creator, and Studio tiers so
            subscription logic can be added without reshaping the product.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Free: one universe", "Creator: unlimited private worlds", "Studio: collaboration later"].map((plan) => (
              <div key={plan} className="rounded-2xl border border-[var(--border)] p-4 text-sm font-medium">
                {plan}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="exports" className="mx-auto flex w-full max-w-7xl items-center gap-3 px-5 pb-16 text-sm text-[var(--muted)] sm:px-8">
        <BookOpen className="size-5" />
        Manuscript, chapter, encyclopedia, character list, location list, CSV, and JSON exports are modeled in the MVP.
      </section>
    </main>
  );
}
