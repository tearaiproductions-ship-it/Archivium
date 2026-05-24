import Link from "next/link";
import { AlertTriangle, BookOpen, Database, PenLine, Sparkles } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import type { DashboardSnapshot } from "@/lib/types/domain";
import { formatNumber } from "@/lib/utils";

export function DashboardOverview({ snapshot }: { snapshot: DashboardSnapshot }) {
  const totalWords = snapshot.stories.reduce((total, story) => total + story.wordCount, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-[var(--muted)]">Private workspace · {snapshot.user.plan} tier</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Good morning, {snapshot.user.displayName}</h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Continue drafting, expand your encyclopedia, and resolve continuity notes from one calm dashboard.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/app/stories" className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white">
              New story
            </Link>
            <Link href="/app/universes" className="rounded-2xl border border-[var(--border)] px-5 py-3 text-center text-sm font-semibold">
              New universe
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Database} label="Universes" value={String(snapshot.universes.length)} helper="Top-level lore databases" />
        <StatCard icon={BookOpen} label="Stories" value={String(snapshot.stories.length)} helper="Drafts across all universes" />
        <StatCard icon={Sparkles} label="Lore entries" value={String(snapshot.loreEntries.length)} helper="Structured encyclopedia records" />
        <StatCard icon={PenLine} label="Words drafted" value={formatNumber(totalWords)} helper="Tracked from story scenes" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent stories</h2>
            <Link href="/app/stories" className="text-sm font-semibold text-[var(--accent)]">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {snapshot.stories.map((story) => (
              <Link
                key={story.id}
                href={`/app/write/${story.id}`}
                className="block rounded-2xl border border-[var(--border)] p-4 transition hover:border-[var(--accent)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{story.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{story.synopsis}</p>
                  </div>
                  <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs font-semibold capitalize">
                    {story.draftStatus}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-5 flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600" />
            <h2 className="text-xl font-semibold">Continuity helper</h2>
          </div>
          <div className="space-y-3">
            {snapshot.continuityIssues.map((issue) => (
              <div key={issue.id} className="rounded-2xl bg-[var(--background)] p-4">
                <p className="text-sm font-semibold">{issue.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{issue.description}</p>
                {issue.location ? <p className="mt-2 text-xs font-medium text-[var(--accent)]">{issue.location}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
