/**
 * Frontend-owned wrapper for the home-page StatsBand metrics.
 *
 * Why this exists instead of importing lib/supabase/stats.ts directly:
 *   - lib/supabase/client.ts THROWS at module load when env vars are missing,
 *     which would crash any page that imports it (e.g. the home page) in local
 *     dev / preview builds without `.env.local`. See issue #12.
 *   - This wrapper reads env lazily and returns `null` on any problem, so the
 *     caller can fall back to static copy and the page never crashes.
 *
 * The underlying RPC `get_platform_stats()` is `security definer` and granted
 * to the `anon` role (see supabase/migrations/002_platform_stats.sql), so a
 * plain anon client is all we need — no user session required.
 */

import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/auth/config";

export interface PlatformStats {
  registeredUsers: number;
  vocabCompletions: number; // total completions across all users
  uniqueTermsLearned: number; // distinct vocab IDs completed by ≥1 user
  translationTasks: number | null; // future feature
  matchesCreated: number | null; // future feature
}

/**
 * Read aggregate platform stats via the Supabase RPC.
 * Returns `null` when Supabase isn't configured or the call fails — callers
 * MUST fall back to static copy in that case.
 */
export async function getPlatformStats(): Promise<PlatformStats | null> {
  const env = getSupabaseEnv();
  if (!env) return null; // not configured — silent static fallback

  try {
    const supabase = createClient(env.url, env.anonKey);
    const { data, error } = await supabase.rpc("get_platform_stats");

    if (error || !data || typeof data !== "object") return null;

    const d = data as Record<string, unknown>;
    return {
      registeredUsers: Number(d.registeredUsers ?? 0),
      vocabCompletions: Number(d.vocabCompletions ?? 0),
      uniqueTermsLearned: Number(d.uniqueTermsLearned ?? 0),
      translationTasks: null,
      matchesCreated: null,
    };
  } catch {
    return null;
  }
}
