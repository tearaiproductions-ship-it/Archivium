"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { toDashboardSnapshot } from "@/lib/workspace/workspace-state";

export function DashboardClient() {
  const { state, isSaving, saveError } = useWorkspace();

  return (
    <div className="space-y-4">
      {saveError ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</p> : null}
      {isSaving ? <p className="text-sm text-[var(--muted)]">Saving workspace…</p> : null}
      <DashboardOverview snapshot={toDashboardSnapshot(state)} />
    </div>
  );
}
