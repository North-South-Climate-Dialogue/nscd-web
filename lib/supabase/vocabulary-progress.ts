import { supabase } from './client'
import type { VocabularyProgressRow } from './types'

// ------------------------------------------------------------
// markVocabCompleted
//
// Marks a vocabulary word as completed for the current user.
// Safe to call multiple times — uses upsert, so it won't
// create duplicate rows.
//
// Usage:
//   await markVocabCompleted('carbon-neutrality')
// ------------------------------------------------------------
export async function markVocabCompleted(vocabId: string): Promise<void> {
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
      {
        // Match on the unique (user_id, vocab_id) pair
        onConflict: 'user_id,vocab_id',
      }
    )

  if (error) {
    throw new Error(`markVocabCompleted failed for "${vocabId}": ${error.message}`)
  }
}


// ------------------------------------------------------------
// getUserProgress
//
// Returns all vocabulary progress rows for the current user.
// The frontend can use this to build a "words learned" count
// or highlight completed words in the glossary.
//
// Usage:
//   const progress = await getUserProgress()
//   const completedIds = progress.filter(p => p.completed).map(p => p.vocab_id)
// ------------------------------------------------------------
export async function getUserProgress(): Promise<VocabularyProgressRow[]> {
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
//   const done = await isVocabCompleted('carbon-neutrality')
// ------------------------------------------------------------
export async function isVocabCompleted(vocabId: string): Promise<boolean> {
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

  // No row yet means the user hasn't started this word
  return data?.completed ?? false
}
