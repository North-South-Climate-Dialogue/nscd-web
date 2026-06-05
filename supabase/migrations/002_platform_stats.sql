-- ============================================================
-- NSCD — Platform Stats RPC
-- ============================================================
-- Exposes a single aggregated read for the home-page StatsBand.
--
-- Why an RPC instead of direct table queries?
--   1. The anon role cannot query auth.users — we count from
--      public.user_profiles instead (safe, already RLS-protected).
--   2. One round-trip instead of three separate client queries.
--   3. No row-level user data ever leaves the database — only
--      three aggregate numbers are returned.
--
-- Called by: lib/supabase/stats.ts → getPlatformStats()
-- Consumed by: components/home/StatsBand.tsx
-- ============================================================

create or replace function public.get_platform_stats()
returns json
language sql
stable        -- result can be cached within a transaction
security definer
set search_path = public
as $$
  select json_build_object(
    'registeredUsers',
      (
        select count(*)::int
        from public.user_profiles
      ),
    'vocabCompletions',
      (
        select count(*)::int
        from public.vocabulary_progress
        where completed = true
      ),
    'uniqueTermsLearned',
      (
        select count(distinct vocab_id)::int
        from public.vocabulary_progress
        where completed = true
      )
  );
$$;

-- Allow any authenticated or anonymous visitor to call this function.
-- It only returns aggregate numbers — no user data is exposed.
grant execute on function public.get_platform_stats() to anon, authenticated;
