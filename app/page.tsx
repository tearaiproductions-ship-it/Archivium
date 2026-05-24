import Link from "next/link";
import { BookOpen, Database, FileDown, GitBranch, Globe2, PenLine, ShieldCheck } from "lucide-react";

import { ProductShowcase } from "@/components/marketing/product-showcase";
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

const workflow = [
  "Create or choose a universe encyclopedia",
  "Start a story and draft chapters with autosave",
  "Highlight names and places to create or link lore entries",
  "Browse the encyclopedia, timeline, and continuity notes"
];

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <SiteHeader />

      <section className="relative mx-auto w-full max-w-[90rem] px-6 pb-16 pt-10 sm:px-10 lg:pb-24 lg:pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(47,106,90,0.14),transparent_65%)]" />
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)]">
              <Globe2 className="size-4 text-[var(--accent)]" />
              Serious writing software for living worlds
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl xl:text-7xl">
              Draft the story. Build the encyclopedia. Keep the canon aligned.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-[var(--muted)]">
              LoreWrite is a mobile and tablet-friendly writing platform where authors draft fiction while growing a
              structured lore database — characters, places, factions, timelines, and more — in the same workspace.
            </p>
            <ul className="mt-8 space-y-3 text-base text-[var(--foreground)]">
              {workflow.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  {step}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/app"
                className="rounded-full bg-[var(--accent)] px-8 py-4 text-center text-base font-semibold text-white shadow-lg shadow-[var(--accent)]/20"
              >
                Open LoreWrite app
              </Link>
              <a
                href="#product"
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-8 py-4 text-center text-base font-semibold"
              >
                See full product scope
              </a>
            </div>
            <p className="mt-6 text-sm text-[var(--muted)]">
              Use the marketing homepage for the big picture. Use <strong>/app</strong> for the full writing workspace
              (wider layout on desktop).
            </p>
          </div>

          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl shadow-black/10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">Ashfall Universe</p>
                <h2 className="text-2xl font-semibold">The Ember Road</h2>
              </div>
              <BookOpen className="size-6 text-[var(--accent)]" />
            </div>
            <div className="grid gap-4 rounded-[1.5rem] bg-[var(--background)] p-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Stories</p>
                <p className="mt-2 text-3xl font-semibold">3+</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Drafts per universe</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Lore entries</p>
                <p className="mt-2 text-3xl font-semibold">∞</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Structured encyclopedia</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Sample draft</p>
                <p className="writing-surface mt-3 text-lg leading-8">
                  Mara crossed the <mark className="rounded bg-amber-200/70 px-1">Black Glass Bridge</mark> before the
                  bells woke the harbor…
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="product">
        <ProductShowcase />
      </div>

      <section id="features" className="mx-auto grid w-full max-w-[90rem] gap-5 px-6 py-16 sm:px-10 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
            <feature.icon className="mb-4 size-7 text-[var(--accent)]" />
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{feature.description}</p>
          </div>
        ))}
      </section>

      <section id="pricing" className="mx-auto w-full max-w-[90rem] px-6 py-16 sm:px-10">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-10">
          <ShieldCheck className="mb-4 size-9 text-[var(--accent)]" />
          <h2 className="text-4xl font-semibold">Pricing-ready from day one</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Version 1 keeps workspaces private and includes placeholders for Free, Creator, and Studio tiers so
            subscription logic can be added without reshaping the product.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Free: one universe", "Creator: unlimited private worlds", "Studio: collaboration later"].map((plan) => (
              <div key={plan} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-base font-medium">
                {plan}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="exports"
        className="mx-auto mb-20 w-full max-w-[90rem] rounded-[2rem] border border-[var(--border)] bg-[var(--accent)] px-8 py-14 text-white sm:px-12"
      >
        <h2 className="text-4xl font-semibold">Ready to try the full workspace?</h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
          Open the app in a full browser tab for the complete dashboard, universe and story creation, writing editor, and
          encyclopedia — not the narrow embedded preview panel.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-base font-semibold text-[var(--accent)]"
        >
          Launch LoreWrite
        </Link>
      </section>
    </main>
  );
}
