/**
 * Mirror of lib/supabase/vocabulary-progress.ts that persists to localStorage
 * instead of Supabase. Exports the SAME three function names + signatures so a
 * future swap to the real Supabase module is one import change.
 *
 * Storage shape:
 *   key:   "nscd.progress.v1"
 *   value: { [vocabId]: { completed: boolean; completed_at: string } }
 */

const STORAGE_KEY = "nscd.progress.v1";
const CHANGE_EVENT = "nscd:progress-changed";

type Row = { completed: boolean; completed_at: string };
type ProgressMap = Record<string, Row>;

function readAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as ProgressMap;
    return {};
  } catch {
    return {};
  }
}

function writeAll(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    // ignore quota errors silently — progress is non-critical
  }
}

export async function markVocabCompleted(vocabId: string): Promise<void> {
  const map = readAll();
  map[vocabId] = { completed: true, completed_at: new Date().toISOString() };
  writeAll(map);
}

export async function unmarkVocabCompleted(vocabId: string): Promise<void> {
  const map = readAll();
  if (map[vocabId]) {
    delete map[vocabId];
    writeAll(map);
  }
}

export interface VocabularyProgressRow {
  user_id: string;
  vocab_id: string;
  completed: boolean;
  completed_at: string;
}

export async function getUserProgress(): Promise<VocabularyProgressRow[]> {
  const map = readAll();
  return Object.entries(map)
    .filter(([, row]) => row.completed)
    .map(([vocab_id, row]) => ({
      user_id: "local",
      vocab_id,
      completed: row.completed,
      completed_at: row.completed_at,
    }))
    .sort((a, b) => b.completed_at.localeCompare(a.completed_at));
}

export async function isVocabCompleted(vocabId: string): Promise<boolean> {
  return readAll()[vocabId]?.completed ?? false;
}

/** Read the full learned-IDs set synchronously — for React state. */
export function getLearnedIdsSync(): Set<string> {
  const map = readAll();
  return new Set(
    Object.entries(map)
      .filter(([, row]) => row.completed)
      .map(([id]) => id),
  );
}

/** Subscribe to local progress changes (same-tab updates + cross-tab storage events). */
export function onProgressChanged(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) handler();
  };
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
