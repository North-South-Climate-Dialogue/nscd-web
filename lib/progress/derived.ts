/**
 * Derived stats over the localStorage progress map. Pure functions; no
 * filesystem or React access. Easy to swap to Supabase later — same shape.
 */

import type { VocabEntry } from "@/types/vocabulary";

export interface ProgressRow {
  vocabId: string;
  completed_at: string; // ISO string
}

/**
 * Read the full progress map directly off localStorage. Pulls dates too so we
 * can compute streaks / recent activity (useProgress only exposes the id Set).
 */
export function readProgressRows(): ProgressRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("nscd.progress.v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as
      | Record<string, { completed: boolean; completed_at: string }>
      | null;
    if (!parsed || typeof parsed !== "object") return [];
    return Object.entries(parsed)
      .filter(([, row]) => row?.completed)
      .map(([vocabId, row]) => ({ vocabId, completed_at: row.completed_at }));
  } catch {
    return [];
  }
}

function dayKey(iso: string): string {
  // YYYY-MM-DD in UTC — used as the key for "did anything happen this day".
  return iso.slice(0, 10);
}

function todayKeyUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function shiftDayKey(key: string, deltaDays: number): string {
  const d = new Date(key + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

/**
 * Consecutive days (ending today or yesterday) with at least one word learned.
 * Today counts; if today has nothing but yesterday does, the streak still
 * stands until today ends.
 */
export function streakDays(rows: ProgressRow[]): number {
  if (rows.length === 0) return 0;
  const days = new Set(rows.map((r) => dayKey(r.completed_at)));

  const today = todayKeyUTC();
  const yesterday = shiftDayKey(today, -1);

  // Anchor: today if it counts, else yesterday if it counts, else 0.
  let cursor: string;
  if (days.has(today)) cursor = today;
  else if (days.has(yesterday)) cursor = yesterday;
  else return 0;

  let count = 0;
  while (days.has(cursor)) {
    count++;
    cursor = shiftDayKey(cursor, -1);
  }
  return count;
}

/** Words learned in the last 7 days (rolling window, inclusive). */
export function learnedThisWeek(rows: ProgressRow[]): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);
  const cutoffIso = cutoff.toISOString();
  return rows.filter((r) => r.completed_at >= cutoffIso).length;
}

/**
 * { categoryName: { learned, total } } for every category in the data.
 * Categories with no terms are omitted.
 */
export function learnedByCategory(
  entries: VocabEntry[],
  learnedIds: Set<string>,
): { category: string; learned: number; total: number }[] {
  const totals = new Map<string, number>();
  const learned = new Map<string, number>();
  for (const e of entries) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + 1);
    if (learnedIds.has(e.id)) {
      learned.set(e.category, (learned.get(e.category) ?? 0) + 1);
    }
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      total,
      learned: learned.get(category) ?? 0,
    }))
    .sort((a, b) => b.learned / b.total - a.learned / a.total);
}

/**
 * Last N learned words, newest first. Each entry resolved against the
 * vocabulary list. Drops rows whose vocabId isn't in the vocab (defensive).
 */
export function recentActivity(
  rows: ProgressRow[],
  entries: VocabEntry[],
  limit = 10,
): { entry: VocabEntry; completed_at: string }[] {
  const byId = new Map(entries.map((e) => [e.id, e]));
  return rows
    .slice()
    .sort((a, b) => b.completed_at.localeCompare(a.completed_at))
    .map((r) => {
      const entry = byId.get(r.vocabId);
      return entry ? { entry, completed_at: r.completed_at } : null;
    })
    .filter((x): x is { entry: VocabEntry; completed_at: string } => x !== null)
    .slice(0, limit);
}

/**
 * "2 days ago" / "just now" / "May 12, 2026" style relative date for UI.
 */
export function relativeDate(iso: string): string {
  const then = new Date(iso);
  const now = new Date();
  const diffSec = Math.round((now.getTime() - then.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}d ago`;
  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: now.getFullYear() === then.getFullYear() ? undefined : "numeric",
  });
}

/** Wipe progress (used by the Reset button on /account/progress). */
export function resetProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("nscd.progress.v1");
    window.dispatchEvent(new CustomEvent("nscd:progress-changed"));
  } catch {
    // ignore
  }
}
