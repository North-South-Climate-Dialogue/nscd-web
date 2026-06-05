import { supabase } from './client'

// ------------------------------------------------------------
// PlatformStats
//
// The three live numbers shown in the home-page StatsBand.
// Metrics 4 and 5 are null until those features are built —
// the frontend renders them as hidden/static in the meantime.
// ------------------------------------------------------------
export interface PlatformStats {
  registeredUsers:   number
  vocabCompletions:  number   // total completions across all users
  uniqueTermsLearned: number  // distinct vocab_ids completed by ≥1 user
  translationTasks:  null     // future — collaborative_tasks feature
  matchesCreated:    null     // future — matching feature
}

// ------------------------------------------------------------
// getPlatformStats
//
// Calls the get_platform_stats() Supabase RPC and returns the
// result. Returns null if Supabase is not configured or the
// call fails — callers should always fall back to static copy.
//
// Usage (in a Next.js server component):
//   const stats = await getPlatformStats()
//   const users = stats?.registeredUsers ?? null
// ------------------------------------------------------------
export async function getPlatformStats(): Promise<PlatformStats | null> {
  try {
    const { data, error } = await supabase.rpc('get_platform_stats')

    if (error) {
      console.error('getPlatformStats error:', error.message)
      return null
    }

    if (!data || typeof data !== 'object') {
      return null
    }

    return {
      registeredUsers:    data.registeredUsers    ?? 0,
      vocabCompletions:   data.vocabCompletions   ?? 0,
      uniqueTermsLearned: data.uniqueTermsLearned ?? 0,
      translationTasks:   null,
      matchesCreated:     null,
    }
  } catch {
    // Supabase not configured locally (missing .env.local) — silent fallback
    return null
  }
}
