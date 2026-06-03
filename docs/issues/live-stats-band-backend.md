# Live StatsBand metrics (backend integration)

> **Status:** Draft / future work — **do not implement yet.**
> This is a coordination note for when the Supabase backend is ready. The
> frontend `StatsBand` should keep rendering its current mock/static values
> until the data sources and helper described below exist.

## Goal

Turn the home‑page `StatsBand` from static editorial copy into a band of
**live platform metrics** sourced from Supabase, without changing the visual
design or breaking the page when the backend is unavailable.

The numbers should answer, at a glance: *how much learning is happening on
NSCD?*

## Frontend component affected

- **`components/home/StatsBand.tsx`** — currently a server component that
  renders three hard‑coded `{ word, caption }` items (`LEARN` / `PRACTICE` /
  `DIALOGUE`). It is rendered once on the home page (`app/page.tsx`).

No other component consumes this data today. When we go live, `StatsBand`
should fetch its numbers on the server (it is already a server component, so
this is a natural fit) and fall back to the current static values if the fetch
fails or the backend is not configured.

## Metrics needed

| # | Metric | MVP? | Notes |
|---|--------|------|-------|
| 1 | Total registered users | ✅ MVP | Count of all users. |
| 2 | Total vocabulary completions across all users | ✅ MVP | Every completion row, summed across users (a term completed by 10 users counts as 10). |
| 3 | Total unique vocabulary terms learned | ✅ MVP | Distinct terms that have been completed by *at least one* user (max = 149). |
| 4 | Total translation tasks completed | ⏳ Future | Depends on the translation‑task feature (not built yet). |
| 5 | Total matches created | ⏳ Future | Depends on the matching/pen‑pal feature (not built yet). |

## Suggested Supabase data sources

These are **suggestions for the backend owner** — the actual table/column names
are owned by the backend and should be confirmed there, not invented by the
frontend.

- **Metric 1 — registered users:** `auth.users` (count), or a public
  `profiles` table if one is exposed to the anon/public role. Prefer a
  view/RPC so we never query `auth.users` directly from the client.
- **Metric 2 — total completions:** the vocabulary‑progress table that backs
  `lib/supabase/vocabulary-progress.ts` (e.g. `vocabulary_progress` /
  `user_vocab_progress`). Count of rows where `completed = true`.
- **Metric 3 — unique terms learned:** `COUNT(DISTINCT vocab_id)` over that
  same progress table where `completed = true`.
- **Metric 4 — translation tasks (future):** a future
  `collaborative_tasks` / `translation_tasks` table.
- **Metric 5 — matches (future):** a future `matches` table — **only** if it
  fits the project's non‑social‑graph constraints (see Notes).

Because counting whole tables from the client is slow and leaks row‑level
detail, the recommendation is to expose **one aggregated read** (a Postgres
view or an RPC) rather than have the frontend run five separate counts.

## Suggested API / helper function shape

Add a single frontend helper that returns all metrics in one shot, mirroring the
existing `lib/supabase/*` style and degrading gracefully:

```ts
// lib/stats/platform.ts  (NEW — frontend-owned wrapper, added later)

export interface PlatformStats {
  registeredUsers: number;
  vocabCompletions: number;      // metric 2
  uniqueTermsLearned: number;    // metric 3
  translationTasks: number | null; // metric 4 — null until feature exists
  matchesCreated: number | null;   // metric 5 — null until feature exists
}

/**
 * Reads aggregate platform stats. Returns `null` when Supabase isn't
 * configured or the read fails, so callers can fall back to static copy.
 */
export async function getPlatformStats(): Promise<PlatformStats | null>;
```

Backed ideally by a single Supabase RPC, e.g.:

```sql
-- Backend-owned. Example only.
create or replace function public.get_platform_stats()
returns json language sql stable as $$
  select json_build_object(
    'registeredUsers',    (select count(*) from public.profiles),
    'vocabCompletions',   (select count(*) from public.vocabulary_progress where completed),
    'uniqueTermsLearned', (select count(distinct vocab_id) from public.vocabulary_progress where completed)
  );
$$;
```

`StatsBand` then becomes:

```tsx
const stats = await getPlatformStats();
// if (!stats) -> render the current static LEARN / PRACTICE / DIALOGUE band
```

## MVP scope

- Implement metrics **1, 2, 3** only.
- One aggregated read (view or RPC) + the `getPlatformStats()` wrapper.
- `StatsBand` shows live numbers when available, **static fallback otherwise**.
- Numbers may be lightly cached (e.g. `revalidate` on the home page) — they do
  not need to be real‑time.

## Future scope

- Metrics **4 and 5** once the translation‑task and matching features ship.
- Optional: per‑metric trend/"this week" deltas.
- Optional: a richer `/about` or dashboard stats view reusing `getPlatformStats()`.

## Acceptance criteria

- [ ] A single server‑side helper returns metrics 1–3 from Supabase.
- [ ] `StatsBand` renders live values when the helper returns data.
- [ ] When Supabase is **not** configured or the read errors, `StatsBand`
      renders the existing static values — the home page never crashes.
- [ ] No secret/admin keys are shipped to the client; `auth.users` is never
      queried directly from the browser.
- [ ] Visual design of `StatsBand` is unchanged (same layout, type, colors).
- [ ] Metrics 4 and 5 are represented as `null`/hidden until their features exist.
- [ ] No regression to existing pages or the localStorage progress fallback.

## Notes for avoiding frontend/backend conflicts

- **Backend boundary:** `data/`, `lib/supabase/`, and `supabase/` are
  backend‑owned. The frontend should only **add** a thin wrapper (e.g.
  `lib/stats/platform.ts`) that calls the backend's view/RPC — it must not
  redefine tables, migrations, or edit existing `lib/supabase/*` files.
- **Confirm names before coding:** table/column/RPC names in this doc are
  *suggestions*. Confirm the real ones with the backend owner first.
- **Aggregate, don't scrape:** expose one view/RPC instead of five client‑side
  counts — faster, and avoids exposing row‑level user data.
- **Non‑social‑graph constraint:** NSCD is **not** a social platform. A
  "matches created" *count* is fine as an aggregate number, but this must not
  introduce any followers/friends/messaging/public‑ranking tables or UI. If a
  metric would require a social graph to compute, stop and re‑scope.
- **Graceful degradation is mandatory:** the static fallback must remain so the
  home page works before the backend lands and in local/dev without env keys.
- **Slug stability:** metric 3 counts distinct vocab IDs — these are the stable
  slugs from `data/vocabulary.json`. Never rename/delete existing slugs.
- **Until this lands:** keep `StatsBand` exactly as it is (mock/static). This
  issue is coordination only — **do not implement Supabase logic now.**
