import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { WorkspaceProvider } from "@/components/workspace/workspace-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <WorkspaceShell>{children}</WorkspaceShell>
    </WorkspaceProvider>
  );
}
