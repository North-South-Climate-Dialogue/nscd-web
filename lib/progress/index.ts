/**
 * Progress router — the single entry point the UI uses for vocabulary progress.
 *
 * Routes every call based on auth state:
 *   - Logged-in users  → Supabase `vocabulary_progress` (synced across devices)
 *   - Logged-out users → localStorage shim (lib/progress/local.ts)
 *
 * The Supabase work is delegated to lib/supabase/vocabulary-progress.ts using
 * the injected-client pattern (Option A, issue #12): we pass the session-aware
 * `@supabase/ssr` browser client (`getBrowserSupabase()`) so the cookie session
 * is visible and `auth.getUser()` resolves to the logged-in user.
 *
 * On the first authed read, any progress saved locally (from before the user
 * signed in) is migrated up to Supabase once, then cleared locally.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/auth/browser";
import * as local from "@/lib/progress/local";
import {
  readProgressRows,
  resetProgress as resetLocalProgress,
  type ProgressRow,
} from "@/lib/progress/derived";
import * as remote from "@/lib/supabase/vocabulary-progress";

const CHANGE_EVENT = "nscd:progress-changed";
const TABLE = "vocabulary_progress";

/** Resolve the session-aware client + user id, or null when logged out. */
async function getAuth(): Promise<{ client: SupabaseClient; userId: string } | null> {
  const client = getBrowserSupabase();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  if (!data.user) return null;
  return { client, userId: data.user.id };
}

/** Fire the same change event the localStorage shim uses, so subscribers refresh. */
function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

/**
 * One-time lift of localStorage progress into Supabase after sign-in.
 * Idempotent: upsert avoids duplicates, and the local store is cleared on
 * success so this becomes a no-op afterwards. The backend helpers operate one
 * row at a time, so the bulk upsert here is done directly on the client.
 */
async function migrateLocalToRemote(client: SupabaseClient, userId: string): Promise<void> {
  const ids = [...local.getLearnedIdsSync()];
  if (ids.length === 0) return;

  const now = new Date().toISOString();
  const rows = ids.map((vocab_id) => ({
    user_id: userId,
    vocab_id,
    completed: true,
    completed_at: now,
  }));

  const { error } = await client.from(TABLE).upsert(rows, {
    onConflict: "user_id,vocab_id",
  });
  if (!error) resetLocalProgress();
}

// ── Reads ────────────────────────────────────────────────────────────────────

/** The set of learned vocab IDs (Supabase when logged in, else localStorage). */
export async function getLearnedIds(): Promise<Set<string>> {
  const auth = await getAuth();
  if (!auth) return local.getLearnedIdsSync();
  try {
    await migrateLocalToRemote(auth.client, auth.userId);
    const rows = await remote.getUserProgress(auth.client);
    return new Set(rows.filter((r) => r.completed).map((r) => r.vocab_id));
  } catch {
    return new Set();
  }
}

/** Progress rows (id + completed_at) for streaks / recent activity / category stats. */
export async function getProgressRows(): Promise<ProgressRow[]> {
  const auth = await getAuth();
  if (!auth) return readProgressRows();
  try {
    await migrateLocalToRemote(auth.client, auth.userId);
    const rows = await remote.getUserProgress(auth.client);
    return rows
      .filter((r) => r.completed)
      .map((r) => ({
        vocabId: r.vocab_id,
        completed_at: r.completed_at ?? new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

/** Whether the current user has completed a single term. */
export async function isVocabCompleted(vocabId: string): Promise<boolean> {
  const auth = await getAuth();
  if (!auth) return local.isVocabCompleted(vocabId);
  try {
    return await remote.isVocabCompleted(auth.client, vocabId);
  } catch {
    return false;
  }
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function markVocabCompleted(vocabId: string): Promise<void> {
  const auth = await getAuth();
  if (!auth) {
    await local.markVocabCompleted(vocabId); // local shim dispatches its own event
    return;
  }
  try {
    await remote.markVocabCompleted(auth.client, vocabId);
    notify();
  } catch {
    // progress is non-critical — swallow transient write errors
  }
}

export async function unmarkVocabCompleted(vocabId: string): Promise<void> {
  const auth = await getAuth();
  if (!auth) {
    await local.unmarkVocabCompleted(vocabId);
    return;
  }
  try {
    await remote.unmarkVocabCompleted(auth.client, vocabId);
    notify();
  } catch {
    // ignore
  }
}

/** Clear all progress — Supabase rows when logged in, otherwise localStorage. */
export async function resetProgress(): Promise<void> {
  const auth = await getAuth();
  if (!auth) {
    resetLocalProgress(); // dispatches its own event
    return;
  }
  try {
    await auth.client.from(TABLE).delete().eq("user_id", auth.userId);
    notify();
  } catch {
    // ignore
  }
}

// ── Subscription ─────────────────────────────────────────────────────────────

/**
 * Subscribe to progress changes. Fires on:
 *   - localStorage writes (same-tab custom event + cross-tab storage event)
 *   - Supabase writes routed through this module (we dispatch the same event)
 *   - auth state changes (login / logout) so the source of truth switches
 */
export function subscribeProgress(handler: () => void): () => void {
  const offLocal = local.onProgressChanged(handler);
  const client = getBrowserSupabase();
  const sub = client?.auth.onAuthStateChange(() => handler());
  return () => {
    offLocal();
    sub?.data.subscription.unsubscribe();
  };
}
