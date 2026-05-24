import { promises as fs } from "node:fs";
import path from "node:path";

import { createDefaultWorkspaceState } from "@/lib/workspace/default-state";
import type { WorkspaceState } from "@/lib/workspace/workspace-state";

const workspaceFile = process.env.VERCEL
  ? path.join("/tmp", "lorewrite-workspace.json")
  : path.join(process.cwd(), "data", "workspace.json");

export async function readWorkspaceState(): Promise<WorkspaceState> {
  try {
    const raw = await fs.readFile(workspaceFile, "utf8");
    const parsed = JSON.parse(raw) as WorkspaceState;
    if (parsed.version !== 1) {
      return createDefaultWorkspaceState();
    }
    return parsed;
  } catch {
    return createDefaultWorkspaceState();
  }
}

export async function writeWorkspaceState(state: WorkspaceState): Promise<void> {
  await fs.mkdir(path.dirname(workspaceFile), { recursive: true });
  await fs.writeFile(workspaceFile, JSON.stringify(state, null, 2), "utf8");
}
