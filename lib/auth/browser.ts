"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/auth/config";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
