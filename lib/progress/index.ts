/**
 * Progress router — the single entry point the UI uses for vocabulary progress.
 *
 * Routes every call based on auth state:
 *   - Logged-in users  → Supabase `vocabulary_progress` (synced across devices)
 *   - Logged-out users → localStorage shim (lib/progress/local.ts)
 *
 * Why we re-implement the Supabase queries here instead of importing
 * lib/supabase/vocabulary-progress.ts:
 *   - Those helpers use a different Supabase client (`@supabase/supabase-js`,
 *     localStorage sessions) than the app's auth flow (`@supabase/ssr`,
 *     cookie sessions), so they can't see a logged-in user's session, and
 *     their module throws at import when env is missing. See issue #12.
 *   - Here we use the SAME session-aware browser client the auth UI uses
 *     (`getBrowserSupabase()`), so sessions line up and nothing crashes when
 *     Supabase isn't configured.
 *
 * On first read while logged in, any progress saved locally (from before the
 * user signed in) is migrated up to Supabase once, then cleared locally.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/auth/browser";
import * as local from "@/lib/progress/local";
import {
  readProgressRows,
  resetProgress as resetLocalProgress,
  type ProgressRow,
} from "@/lib/progress/derived";

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
 * success so this becomes a no-op afterwards.
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

  await migrateLocalToRemote(auth.client, auth.userId);
  const { data, error } = await auth.client
    .from(TABLE)
    .select("vocab_id")
    .eq("user_id", auth.userId)
    .eq("completed", true);

  if (error) return new Set();
  return new Set((data ?? []).map((r) => (r as { vocab_id: string }).vocab_id));
}

/** Progress rows (id + completed_at) for streaks / recent activity / category stats. */
export async function getProgressRows(): Promise<ProgressRow[]> {
  const auth = await getAuth();
  if (!auth) return readProgressRows();

  await migrateLocalToRemote(auth.client, auth.userId);
  const { data, error } = await auth.client
    .from(TABLE)
    .select("vocab_id, completed_at")
    .eq("user_id", auth.userId)
    .eq("completed", true);

  if (error) return [];
  return (data ?? []).map((r) => {
    const row = r as { vocab_id: string; completed_at: string | null };
    return { vocabId: row.vocab_id, completed_at: row.completed_at ?? new Date().toISOString() };
  });
}

/** Whether the current user has completed a single term. */
export async function isVocabCompleted(vocabId: string): Promise<boolean> {
  const auth = await getAuth();
  if (!auth) return local.isVocabCompleted(vocabId);

  const { data, error } = await auth.client
    .from(TABLE)
    .select("completed")
    .eq("user_id", auth.userId)
    .eq("vocab_id", vocabId)
    .maybeSingle();

  if (error) return false;
  return (data as { completed: boolean } | null)?.completed ?? false;
}

// ── Writes ───────────────────────────────────────────────────────────────────

export async function markVocabCompleted(vocabId: string): Promise<void> {
  const auth = await getAuth();
  if (!auth) {
    await local.markVocabCompleted(vocabId); // local shim dispatches its own event
    return;
  }
  await auth.client.from(TABLE).upsert(
    {
      user_id: auth.userId,
      vocab_id: vocabId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,vocab_id" },
  );
  notify();
}

export async function unmarkVocabCompleted(vocabId: string): Promise<void> {
  const auth = await getAuth();
  if (!auth) {
    await local.unmarkVocabCompleted(vocabId);
    return;
  }
  await auth.client
    .from(TABLE)
    .delete()
    .eq("user_id", auth.userId)
    .eq("vocab_id", vocabId);
  notify();
}

/** Clear all progress — Supabase rows when logged in, otherwise localStorage. */
export async function resetProgress(): Promise<void> {
  const auth = await getAuth();
  if (!auth) {
    resetLocalProgress(); // dispatches its own event
    return;
  }
  await auth.client.from(TABLE).delete().eq("user_id", auth.userId);
  notify();
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
