-- ============================================================
-- NSCD — Collaboration Schema
-- ============================================================
-- Architecture reminder (see supabase/README.md):
--   • Users interact through shared educational ARTIFACTS,
--     not through each other directly.
--   • No direct messaging, follower graphs, or social feeds.
--     See issue #2 for the full policy.
--
-- This migration adds:
--   1. is_facilitator flag on user_profiles
--   2. glossary_contributions  (issue #3)
--   3. workshop_cohorts        (issue #4)
--   4. cohort_members          (issue #4)
--   5. collaborative_tasks     (issue #5)
--   6. task_submissions        (issue #5)
-- ============================================================


-- ------------------------------------------------------------
-- 1. FACILITATOR FLAG
--    Added to the existing user_profiles table.
--    Flip to true manually in Supabase for teachers / NGO
--    coordinators / NSCD team members.
--    Default false — new sign-ups are always regular learners.
-- ------------------------------------------------------------

alter table public.user_profiles
  add column if not exists is_facilitator boolean not null default false;


-- ------------------------------------------------------------
-- 2. GLOSSARY CONTRIBUTIONS
--    Users suggest improved translations or example sentences
--    for vocabulary terms. Nothing is published automatically
--    — every contribution goes through a facilitator review.
--
--    vocab_id matches the "id" slug in data/vocabulary.json.
-- ------------------------------------------------------------

create table if not exists public.glossary_contributions (
  id                     uuid        primary key default gen_random_uuid(),
  vocab_id               text        not null,
  user_id                uuid        not null references auth.users(id) on delete cascade,

  suggested_translation  text        not null,
  suggested_example      text,

  -- Workflow state
  status                 text        not null default 'pending'
                         check (status in ('pending', 'approved', 'rejected', 'needs_revision')),

  -- Set by facilitator when they act on the contribution
  reviewer_id            uuid        references auth.users(id),
  reviewer_comment       text,
  reviewed_at            timestamptz,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

drop trigger if exists set_glossary_contributions_updated_at on public.glossary_contributions;
create trigger set_glossary_contributions_updated_at
  before update on public.glossary_contributions
  for each row execute procedure public.set_updated_at();

create index if not exists glossary_contributions_user_id_idx
  on public.glossary_contributions (user_id);

create index if not exists glossary_contributions_vocab_id_idx
  on public.glossary_contributions (vocab_id);

create index if not exists glossary_contributions_status_idx
  on public.glossary_contributions (status);

-- RLS
alter table public.glossary_contributions enable row level security;

-- Users can submit contributions
create policy "Users can insert own contributions"
  on public.glossary_contributions for insert
  with check (auth.uid() = user_id);

-- Users can view and edit their own contributions
create policy "Users can view own contributions"
  on public.glossary_contributions for select
  using (auth.uid() = user_id);

create policy "Users can update own pending contributions"
  on public.glossary_contributions for update
  using (auth.uid() = user_id and status = 'pending');

-- Approved contributions are visible to all logged-in users
-- (so the glossary can show community-contributed examples)
create policy "Approved contributions visible to authenticated users"
  on public.glossary_contributions for select
  using (status = 'approved' and auth.role() = 'authenticated');

-- Facilitators can see everything and update status / add feedback
create policy "Facilitators can view all contributions"
  on public.glossary_contributions for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_facilitator = true
    )
  );

create policy "Facilitators can update contributions"
  on public.glossary_contributions for update
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_facilitator = true
    )
  );


-- ------------------------------------------------------------
-- 3. WORKSHOP COHORTS
--    The primary container for collaborative work on NSCD.
--    Users join a cohort via a short join_code — there is no
--    public directory of cohorts to browse.
-- ------------------------------------------------------------

create table if not exists public.workshop_cohorts (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  description     text,
  theme           text,       -- e.g. "COP30 Vocabulary Sprint"

  facilitator_id  uuid        not null references auth.users(id),

  -- Short alphanumeric code users type to join (e.g. "NSCD24")
  join_code       text        unique,

  max_members     int,        -- null = unlimited
  is_active       boolean     not null default true,

  created_at      timestamptz not null default now()
);

create index if not exists workshop_cohorts_facilitator_id_idx
  on public.workshop_cohorts (facilitator_id);

-- RLS enabled here; policies that reference cohort_members are
-- added AFTER that table is created below (ordering fix).
alter table public.workshop_cohorts enable row level security;

-- Facilitators can create and manage cohorts (no cross-table ref)
create policy "Facilitators can insert cohorts"
  on public.workshop_cohorts for insert
  with check (
    auth.uid() = facilitator_id
    and exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_facilitator = true
    )
  );

create policy "Facilitators can update own cohorts"
  on public.workshop_cohorts for update
  using (auth.uid() = facilitator_id);


-- ------------------------------------------------------------
-- 4. COHORT MEMBERS
--    Junction table linking users to cohorts.
--    One row per (cohort, user) pair — enforced by unique
--    constraint. Role controls what a member can do inside
--    the cohort.
-- ------------------------------------------------------------

create table if not exists public.cohort_members (
  id          uuid        primary key default gen_random_uuid(),
  cohort_id   uuid        not null references public.workshop_cohorts(id) on delete cascade,
  user_id     uuid        not null references auth.users(id) on delete cascade,

  -- learner   = completes tasks
  -- reviewer  = can approve contributions within the cohort
  -- facilitator = full management access
  role        text        not null default 'learner'
              check (role in ('learner', 'reviewer', 'facilitator')),

  joined_at   timestamptz not null default now(),

  constraint cohort_members_unique unique (cohort_id, user_id)
);

create index if not exists cohort_members_user_id_idx
  on public.cohort_members (user_id);

create index if not exists cohort_members_cohort_id_idx
  on public.cohort_members (cohort_id);

-- RLS
alter table public.cohort_members enable row level security;

-- Users can see their own membership rows
create policy "Users can view own memberships"
  on public.cohort_members for select
  using (auth.uid() = user_id);

-- Members can see other members of shared cohorts
-- (user_id only — no profile info exposed here)
create policy "Members can view fellow cohort members"
  on public.cohort_members for select
  using (
    exists (
      select 1 from public.cohort_members cm
      where cm.cohort_id = cohort_members.cohort_id
      and   cm.user_id   = auth.uid()
    )
  );

-- Users can join a cohort themselves (via join_code flow on frontend)
create policy "Users can join cohorts"
  on public.cohort_members for insert
  with check (auth.uid() = user_id);

-- Facilitators can add/remove members
create policy "Facilitators can manage cohort members"
  on public.cohort_members for all
  using (
    exists (
      select 1 from public.workshop_cohorts wc
      where wc.id = cohort_members.cohort_id
      and   wc.facilitator_id = auth.uid()
    )
  );

-- workshop_cohorts policy that references cohort_members —
-- added here now that cohort_members exists.
create policy "Members can view their cohorts"
  on public.workshop_cohorts for select
  using (
    exists (
      select 1 from public.cohort_members
      where cohort_id = workshop_cohorts.id
      and   user_id   = auth.uid()
    )
  );


-- ------------------------------------------------------------
-- 5. COLLABORATIVE TASKS
--    Assigned by a facilitator within a cohort. Tasks are the
--    mechanism through which users work on real climate content
--    together — translation, glossary review, annotation.
--
--    Tasks belong to cohorts; you can only see tasks for
--    cohorts you are a member of.
-- ------------------------------------------------------------

create table if not exists public.collaborative_tasks (
  id            uuid        primary key default gen_random_uuid(),
  cohort_id     uuid        not null references public.workshop_cohorts(id) on delete cascade,

  -- translation   = translate a climate text EN <-> ZH
  -- glossary_review = review and improve vocabulary entries
  -- annotation    = tag climate terms in an article
  type          text        not null
                check (type in ('translation', 'glossary_review', 'annotation')),

  title         text        not null,
  instructions  text        not null,

  source_text   text,       -- text to translate or annotate
  source_url    text,       -- link to source article (real climate journalism)

  due_at        timestamptz,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists collaborative_tasks_cohort_id_idx
  on public.collaborative_tasks (cohort_id);

-- RLS
alter table public.collaborative_tasks enable row level security;

-- Members can see tasks in their cohorts
create policy "Members can view cohort tasks"
  on public.collaborative_tasks for select
  using (
    exists (
      select 1 from public.cohort_members
      where cohort_id = collaborative_tasks.cohort_id
      and   user_id   = auth.uid()
    )
  );

-- Facilitators can create and manage tasks
create policy "Facilitators can manage tasks"
  on public.collaborative_tasks for all
  using (
    exists (
      select 1 from public.workshop_cohorts wc
      where wc.id = collaborative_tasks.cohort_id
      and   wc.facilitator_id = auth.uid()
    )
  );


-- ------------------------------------------------------------
-- 6. TASK SUBMISSIONS
--    One submission row per (user, task) pair. Users draft
--    their work, then submit. Facilitators review and leave
--    feedback. No peer scoring or public ranking.
-- ------------------------------------------------------------

create table if not exists public.task_submissions (
  id                   uuid        primary key default gen_random_uuid(),
  task_id              uuid        not null references public.collaborative_tasks(id) on delete cascade,
  user_id              uuid        not null references auth.users(id) on delete cascade,

  content              text        not null,

  -- draft      = work in progress, not yet submitted
  -- submitted  = user has submitted, awaiting facilitator review
  -- reviewed   = facilitator has left feedback
  status               text        not null default 'draft'
                       check (status in ('draft', 'submitted', 'reviewed')),

  facilitator_feedback text,
  reviewed_at          timestamptz,
  submitted_at         timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  -- One submission per user per task
  constraint task_submissions_unique unique (task_id, user_id)
);

drop trigger if exists set_task_submissions_updated_at on public.task_submissions;
create trigger set_task_submissions_updated_at
  before update on public.task_submissions
  for each row execute procedure public.set_updated_at();

create index if not exists task_submissions_user_id_idx
  on public.task_submissions (user_id);

create index if not exists task_submissions_task_id_idx
  on public.task_submissions (task_id);

-- RLS
alter table public.task_submissions enable row level security;

-- Users can manage their own submissions
create policy "Users can manage own submissions"
  on public.task_submissions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Facilitators can view all submissions for tasks in their cohorts
create policy "Facilitators can view cohort submissions"
  on public.task_submissions for select
  using (
    exists (
      select 1
      from   public.collaborative_tasks ct
      join   public.workshop_cohorts    wc on wc.id = ct.cohort_id
      where  ct.id = task_submissions.task_id
      and    wc.facilitator_id = auth.uid()
    )
  );

-- Facilitators can update submissions to add feedback
create policy "Facilitators can update submissions for feedback"
  on public.task_submissions for update
  using (
    exists (
      select 1
      from   public.collaborative_tasks ct
      join   public.workshop_cohorts    wc on wc.id = ct.cohort_id
      where  ct.id = task_submissions.task_id
      and    wc.facilitator_id = auth.uid()
    )
  );
