import { NextResponse } from "next/server";

import { readWorkspaceState, writeWorkspaceState } from "@/lib/workspace/server-store";
import type { WorkspaceState } from "@/lib/workspace/workspace-state";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readWorkspaceState();
  return NextResponse.json(state);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as WorkspaceState;
    if (!body || body.version !== 1) {
      return NextResponse.json({ error: "Invalid workspace payload" }, { status: 400 });
    }

    const nextState: WorkspaceState = {
      ...body,
      version: 1,
      updatedAt: new Date().toISOString()
    };

    await writeWorkspaceState(nextState);
    return NextResponse.json(nextState);
  } catch {
    return NextResponse.json({ error: "Failed to save workspace" }, { status: 500 });
  }
}
