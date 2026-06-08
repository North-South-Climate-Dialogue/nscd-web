/**
 * lib/supabase/stats.ts
 *
 * Reads aggregate platform stats via the get_platform_stats() RPC.
 * Uses getServerSupabase() (cookie-aware, @supabase/ssr) so it works
 * correctly in Next.js server components.
 *
 * Returns null when Supabase is not configured — callers (e.g. StatsBand)
 * must fall back to static copy. The page will never crash.
 */

import { getServerSupabase } from '@/lib/auth/server'

// ------------------------------------------------------------
// PlatformStats
//
// The three live numbers shown in the home-page StatsBand.
// Metrics 4 and 5 are null until those features are built —
// the frontend renders them as hidden/static in the meantime.
// ------------------------------------------------------------
export interface PlatformStats {
  registeredUsers:    number
  vocabCompletions:   number    // total completions across all users
  uniqueTermsLearned: number    // distinct vocab_ids completed by ≥1 user
  translationTasks:   null      // future — collaborative_tasks feature
  matchesCreated:     null      // future — matching feature
}

// ------------------------------------------------------------
// getPlatformStats
//
// Calls the get_platform_stats() Supabase RPC.
// Must be called from a server component or server action only.
//
// Usage (in a Next.js server component):
//   const stats = await getPlatformStats()
//   const users = stats?.registeredUsers ?? null
// ------------------------------------------------------------
export async function getPlatformStats(): Promise<PlatformStats | null> {
  try {
    const supabase = getServerSupabase()
    if (!supabase) return null

    const { data, error } = await supabase.rpc('get_platform_stats')

    if (error) {
      console.error('getPlatformStats error:', error.message)
      return null
    }

    if (!data || typeof data !== 'object') return null

    return {
      registeredUsers:    (data as any).registeredUsers    ?? 0,
      vocabCompletions:   (data as any).vocabCompletions   ?? 0,
      uniqueTermsLearned: (data as any).uniqueTermsLearned ?? 0,
      translationTasks:   null,
      matchesCreated:     null,
    }
  } catch {
    // Supabase not configured (missing .env.local) — silent fallback
    return null
  }
}
