"use client";

import { useState } from "react";
import Link from "next/link";

import { createSupabaseBrowserClient } from "@/lib/auth/browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();

  async function handlePasswordAuth(mode: "sign-in" | "sign-up") {
    setIsLoading(true);
    setStatus(null);

    if (!supabase) {
      setStatus("Supabase env vars are not configured. The app is running in demo workspace mode.");
      setIsLoading(false);
      return;
    }

    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setStatus(result.error.message);
      setIsLoading(false);
      return;
    }

    window.location.href = "/app";
  }

  async function handleMagicLink() {
    setIsLoading(true);
    setStatus(null);

    if (!supabase) {
      setStatus("Supabase env vars are not configured. The app is running in demo workspace mode.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/app`
      }
    });

    setStatus(error ? error.message : "Check your email for a secure sign-in link.");
    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl shadow-black/5">
      <Link href="/" className="mb-8 inline-flex items-center gap-3 font-semibold">
        <span className="grid size-10 place-items-center rounded-2xl bg-[var(--accent)] text-white">L</span>
        LoreWrite
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">Sign in to your private workspace</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        Use Supabase email/password or magic links in production. Without credentials, LoreWrite opens a demo
        workspace so the MVP can be explored immediately.
      </p>

      <form className="mt-8 space-y-4" onSubmit={(event) => event.preventDefault()}>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            placeholder="writer@example.com"
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--accent)]"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handlePasswordAuth("sign-in")}
            className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            Sign in
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handlePasswordAuth("sign-up")}
            className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold disabled:opacity-60"
          >
            Create account
          </button>
        </div>
        <button
          type="button"
          disabled={isLoading || !email}
          onClick={handleMagicLink}
          className="w-full rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold disabled:opacity-60"
        >
          Email me a magic link
        </button>
      </form>

      <Link
        href="/app"
        className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold"
      >
        Continue without sign-in (test mode)
      </Link>

      {status ? (
        <div className="mt-5 rounded-2xl bg-[var(--background)] p-4 text-sm text-[var(--muted)]">{status}</div>
      ) : null}
    </div>
  );
}
