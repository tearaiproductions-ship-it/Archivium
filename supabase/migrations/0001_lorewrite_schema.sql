create extension if not exists "pgcrypto";

create type public.story_draft_status as enum ('planning', 'drafting', 'revising', 'complete', 'archived');
create type public.canon_status as enum ('draft', 'canon', 'retconned', 'archived');
create type public.subscription_plan as enum ('free', 'creator', 'studio');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  plan public.subscription_plan not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.universes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  universe_id uuid not null references public.universes(id) on delete cascade,
  title text not null,
  synopsis text not null default '',
  draft_status public.story_draft_status not null default 'planning',
  word_count integer not null default 0,
  timeline_position text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  word_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  body text not null default '',
  sort_order integer not null default 0,
  word_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lore_entry_types (
  id text primary key,
  label text not null,
  description text not null default '',
  sort_order integer not null default 0
);

create table public.lore_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  universe_id uuid not null references public.universes(id) on delete cascade,
  type_id text not null references public.lore_entry_types(id),
  name text not null,
  short_summary text not null default '',
  full_description text not null default '',
  canon_status public.canon_status not null default 'draft',
  notes text not null default '',
  first_mentioned_story_id uuid references public.stories(id) on delete set null,
  first_mentioned_chapter_id uuid references public.chapters(id) on delete set null,
  first_mentioned_scene_id uuid references public.scenes(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lore_relationships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  universe_id uuid not null references public.universes(id) on delete cascade,
  source_entry_id uuid not null references public.lore_entries(id) on delete cascade,
  target_entry_id uuid not null references public.lore_entries(id) on delete cascade,
  relationship_type text not null default 'related',
  notes text not null default '',
  created_at timestamptz not null default now(),
  check (source_entry_id <> target_entry_id),
  unique (source_entry_id, target_entry_id, relationship_type)
);

create table public.lore_mentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  universe_id uuid not null references public.universes(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  scene_id uuid references public.scenes(id) on delete set null,
  lore_entry_id uuid references public.lore_entries(id) on delete cascade,
  mention_text text not null,
  start_offset integer,
  end_offset integer,
  is_resolved boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  universe_id uuid not null references public.universes(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (universe_id, name)
);

create table public.entry_tags (
  entry_id uuid not null references public.lore_entries(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (entry_id, tag_id)
);

create table public.timelines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  universe_id uuid not null references public.universes(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  universe_id uuid not null references public.universes(id) on delete cascade,
  timeline_id uuid references public.timelines(id) on delete cascade,
  title text not null,
  description text not null default '',
  date_label text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.timeline_event_entries (
  timeline_event_id uuid not null references public.timeline_events(id) on delete cascade,
  lore_entry_id uuid not null references public.lore_entries(id) on delete cascade,
  primary key (timeline_event_id, lore_entry_id)
);

insert into public.lore_entry_types (id, label, description, sort_order) values
  ('character', 'Character', 'People, protagonists, rivals, and named figures.', 10),
  ('location', 'Location', 'Places, cities, landmarks, planets, and regions.', 20),
  ('faction', 'Faction', 'Guilds, houses, nations, institutions, and groups.', 30),
  ('species', 'Species/Race', 'Cultures, species, ancestries, or created peoples.', 40),
  ('item', 'Item/Artefact', 'Objects, relics, weapons, texts, and important props.', 50),
  ('system', 'Magic/Technology', 'Rules, powers, sciences, rituals, and constraints.', 60),
  ('event', 'Event', 'Wars, births, deaths, disasters, and historical moments.', 70),
  ('term', 'Term/Glossary', 'Language, concepts, titles, slang, and definitions.', 80),
  ('note', 'Note', 'Flexible research notes and unstructured worldbuilding.', 90)
on conflict (id) do nothing;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_users_updated_at before update on public.users
  for each row execute function public.touch_updated_at();
create trigger touch_universes_updated_at before update on public.universes
  for each row execute function public.touch_updated_at();
create trigger touch_stories_updated_at before update on public.stories
  for each row execute function public.touch_updated_at();
create trigger touch_chapters_updated_at before update on public.chapters
  for each row execute function public.touch_updated_at();
create trigger touch_scenes_updated_at before update on public.scenes
  for each row execute function public.touch_updated_at();
create trigger touch_lore_entries_updated_at before update on public.lore_entries
  for each row execute function public.touch_updated_at();
create trigger touch_timelines_updated_at before update on public.timelines
  for each row execute function public.touch_updated_at();
create trigger touch_timeline_events_updated_at before update on public.timeline_events
  for each row execute function public.touch_updated_at();

alter table public.users enable row level security;
alter table public.universes enable row level security;
alter table public.stories enable row level security;
alter table public.chapters enable row level security;
alter table public.scenes enable row level security;
alter table public.lore_entries enable row level security;
alter table public.lore_relationships enable row level security;
alter table public.lore_mentions enable row level security;
alter table public.tags enable row level security;
alter table public.entry_tags enable row level security;
alter table public.timelines enable row level security;
alter table public.timeline_events enable row level security;
alter table public.timeline_event_entries enable row level security;

create policy "Users can manage own profile" on public.users
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy "Entry types are readable by authenticated users" on public.lore_entry_types
  for select to authenticated using (true);

create policy "Users manage own universes" on public.universes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own stories" on public.stories
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own chapters" on public.chapters
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own scenes" on public.scenes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own lore entries" on public.lore_entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own lore relationships" on public.lore_relationships
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own lore mentions" on public.lore_mentions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own tags" on public.tags
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own timelines" on public.timelines
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own timeline events" on public.timeline_events
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Users manage tags through owned entries" on public.entry_tags
  for all using (
    exists (
      select 1 from public.lore_entries
      where lore_entries.id = entry_tags.entry_id
        and lore_entries.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.lore_entries
      where lore_entries.id = entry_tags.entry_id
        and lore_entries.user_id = auth.uid()
    )
  );

create policy "Users manage event links through owned events" on public.timeline_event_entries
  for all using (
    exists (
      select 1 from public.timeline_events
      where timeline_events.id = timeline_event_entries.timeline_event_id
        and timeline_events.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.timeline_events
      where timeline_events.id = timeline_event_entries.timeline_event_id
        and timeline_events.user_id = auth.uid()
    )
  );

create index universes_user_idx on public.universes(user_id);
create index stories_user_universe_idx on public.stories(user_id, universe_id);
create index chapters_story_idx on public.chapters(story_id, sort_order);
create index scenes_chapter_idx on public.scenes(chapter_id, sort_order);
create index lore_entries_universe_type_idx on public.lore_entries(universe_id, type_id);
create unique index lore_entries_universe_lower_name_type_idx on public.lore_entries(universe_id, lower(name), type_id);
create index lore_mentions_entry_idx on public.lore_mentions(lore_entry_id);
create index lore_mentions_unresolved_idx on public.lore_mentions(universe_id, is_resolved);
create index timeline_events_universe_idx on public.timeline_events(universe_id, sort_order);
