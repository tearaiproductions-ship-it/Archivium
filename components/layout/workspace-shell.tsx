import Link from "next/link";
import { BookOpen, Clock3, Home, LibraryBig, PenSquare, Settings, Sparkles } from "lucide-react";

const navigation = [
  { href: "/app", label: "Dashboard", icon: Home },
  { href: "/app/universes", label: "Universes", icon: LibraryBig },
  { href: "/app/stories", label: "Stories", icon: BookOpen },
  { href: "/app/encyclopedia", label: "Encyclopedia", icon: Sparkles },
  { href: "/app/timeline", label: "Timeline", icon: Clock3 },
  { href: "/app/settings", label: "Settings", icon: Settings }
];

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--card)]/95 px-2 py-2 backdrop-blur lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-r lg:border-t-0 lg:px-4 lg:py-6">
        <Link href="/app" className="mb-8 hidden items-center gap-3 px-3 font-semibold lg:flex">
          <span className="grid size-10 place-items-center rounded-2xl bg-[var(--accent)] text-white">L</span>
          <span className="text-xl tracking-tight">LoreWrite</span>
        </Link>
        <nav className="grid grid-cols-6 gap-1 lg:grid-cols-1 lg:gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)] lg:flex-row lg:gap-3 lg:px-3 lg:py-3 lg:text-sm"
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/app/write/ember-road"
          className="mt-6 hidden items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white lg:flex"
        >
          <PenSquare className="size-4" />
          Continue draft
        </Link>
      </aside>
      <main className="pb-24 lg:pl-72">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
