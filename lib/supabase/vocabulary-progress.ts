/**
 * lib/supabase/vocabulary-progress.ts
 *
 * Supabase-backed vocabulary progress helpers.
 *
 * IMPORTANT — client injection pattern (Option A from issue #12):
 * These functions accept a SupabaseClient parameter instead of importing a
 * singleton. This ensures the session-aware SSR client (@supabase/ssr,
 * cookie-based) is used rather than a plain createClient() that reads
 * localStorage and cannot see the logged-in session.
 *
 * Usage in a client component:
 *   import { getBrowserSupabase } from '@/lib/auth/browser'
 *   const client = getBrowserSupabase()
 *   if (client) await markVocabCompleted(client, 'carbon-neutrality')
 *
 * Usage in a server component / action:
 *   import { getServerSupabase } from '@/lib/auth/server'
 *   const client = getServerSupabase()
 *   if (client) await getUserProgress(client)
 *
 * The router that chooses between localStorage (logged-out) and these
 * Supabase helpers (logged-in) lives in lib/progress/index.ts (issue #8).
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { VocabularyProgressRow } from './types'

// ------------------------------------------------------------
// markVocabCompleted
//
// Marks a vocabulary word as completed for the current user.
// Safe to call multiple times — uses upsert, so it won't
// create duplicate rows.
//
// Usage:
//   await markVocabCompleted(client, 'carbon-neutrality')
// ------------------------------------------------------------
export async function markVocabCompleted(
  supabase: SupabaseClient,
  vocabId: string,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('markVocabCompleted: no authenticated user')
  }

  const { error } = await supabase
    .from('vocabulary_progress')
    .upsert(
      {
        user_id:      user.id,
        vocab_id:     vocabId,
        completed:    true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,vocab_id' },
    )

  if (error) {
    throw new Error(`markVocabCompleted failed for "${vocabId}": ${error.message}`)
  }
}


// ------------------------------------------------------------
// unmarkVocabCompleted
//
// Removes the completion record for a vocabulary word, letting
// the user reset and re-learn it. Mirrors the same function in
// lib/progress/local.ts — same name, same signature (+ client).
//
// Safe to call even if the word was never completed.
//
// Usage:
//   await unmarkVocabCompleted(client, 'carbon-neutrality')
// ------------------------------------------------------------
export async function unmarkVocabCompleted(
  supabase: SupabaseClient,
  vocabId: string,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('unmarkVocabCompleted: no authenticated user')
  }

  const { error } = await supabase
    .from('vocabulary_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('vocab_id', vocabId)

  if (error) {
    throw new Error(`unmarkVocabCompleted failed for "${vocabId}": ${error.message}`)
  }
}


// ------------------------------------------------------------
// getUserProgress
//
// Returns all vocabulary progress rows for the current user.
//
// Usage:
//   const rows = await getUserProgress(client)
//   const completedIds = rows.filter(r => r.completed).map(r => r.vocab_id)
// ------------------------------------------------------------
export async function getUserProgress(
  supabase: SupabaseClient,
): Promise<VocabularyProgressRow[]> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('getUserProgress: no authenticated user')
  }

  const { data, error } = await supabase
    .from('vocabulary_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (error) {
    throw new Error(`getUserProgress failed: ${error.message}`)
  }

  return data ?? []
}


// ------------------------------------------------------------
// isVocabCompleted
//
// Returns true if the current user has completed a specific
// vocabulary word, false otherwise.
//
// Usage:
//   const done = await isVocabCompleted(client, 'carbon-neutrality')
// ------------------------------------------------------------
export async function isVocabCompleted(
  supabase: SupabaseClient,
  vocabId: string,
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('isVocabCompleted: no authenticated user')
  }

  const { data, error } = await supabase
    .from('vocabulary_progress')
    .select('completed')
    .eq('user_id', user.id)
    .eq('vocab_id', vocabId)
    .maybeSingle()

  if (error) {
    throw new Error(`isVocabCompleted failed for "${vocabId}": ${error.message}`)
  }

  return data?.completed ?? false
}
