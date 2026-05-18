-- ============================================================
-- NSCD MVP — Initial Schema
-- ============================================================
-- Architecture:
--   • Vocabulary content lives in data/vocabulary.json (local)
--   • Supabase tracks only user accounts + completion state
--   • vocab_id is a slug string (e.g. "carbon-neutrality")
--     that matches the "id" field in vocabulary.json
-- ============================================================


-- ------------------------------------------------------------
-- 1. USER PROFILES
--    Automatically created when a user signs up via auth.
--    Linked 1-to-1 with auth.users.
-- ------------------------------------------------------------

create table if not exists public.user_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ------------------------------------------------------------
-- 2. VOCABULARY PROGRESS
--    One row per (user, vocab word). Tracks completion only.
--    vocab_id matches the "id" field in vocabulary.json.
-- ------------------------------------------------------------

create table if not exists public.vocabulary_progress (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  vocab_id      text        not null,
  completed     boolean     not null default false,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- One progress row per user per word — no duplicates
  constraint vocabulary_progress_user_vocab_unique unique (user_id, vocab_id)
);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_vocabulary_progress_updated_at on public.vocabulary_progress;
create trigger set_vocabulary_progress_updated_at
  before update on public.vocabulary_progress
  for each row execute procedure public.set_updated_at();


-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
--    Users can only read and write their own rows.
-- ------------------------------------------------------------

-- user_profiles
alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);


-- vocabulary_progress
alter table public.vocabulary_progress enable row level security;

create policy "Users can view own progress"
  on public.vocabulary_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.vocabulary_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.vocabulary_progress for update
  using (auth.uid() = user_id);


-- ------------------------------------------------------------
-- 4. INDEXES
--    Speed up the most common query: all progress for a user.
-- ------------------------------------------------------------

create index if not exists vocabulary_progress_user_id_idx
  on public.vocabulary_progress (user_id);

create index if not exists vocabulary_progress_user_vocab_idx
  on public.vocabulary_progress (user_id, vocab_id);
