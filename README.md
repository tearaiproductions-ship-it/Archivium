# LoreWrite

LoreWrite is a mobile-first writing and worldbuilding SaaS MVP for authors who want to draft stories while building a
structured encyclopedia for each universe.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase auth/database integration points
- PostgreSQL schema with row-level security policies

## Product modules

- Landing page with pricing-ready SaaS positioning
- Supabase-compatible auth flow with demo mode fallback
- Workspace dashboard
- Universe creation
- Story creation with existing/new universe logic
- Writing editor with autosave, selection capture, and lore drawer
- Encyclopedia dashboard with filters and CSV/JSON export
- Timeline continuity view
- Account/settings placeholders for upgrades, sharing, and dark mode
- Service layers for lore, timeline, continuity, and exports

## Database

The initial Supabase migration lives at:

```text
supabase/migrations/0001_lorewrite_schema.sql
```

It includes user-scoped tables for universes, stories, chapters, scenes, lore entries, relationships, mentions, tags,
timelines, and timeline events. Row-level security policies keep Version 1 private by user.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` to enable Supabase auth:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Without Supabase credentials, the app runs in demo workspace mode so the MVP can be explored immediately.
