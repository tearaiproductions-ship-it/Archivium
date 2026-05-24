import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" className="flex items-center gap-3 font-semibold">
        <span className="grid size-10 place-items-center rounded-2xl bg-[var(--accent)] text-lg text-white shadow-sm">
          L
        </span>
        <span className="text-xl tracking-tight">LoreWrite</span>
      </Link>
      <nav className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
        <a href="#product">Product</a>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
              </nav>
      <div className="flex items-center gap-3">
        <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground)]">
          Sign in
        </Link>
        <Link
          href="/app"
          className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] shadow-sm"
        >
          Open app
        </Link>
      </div>
    </header>
  );
}
