import vocabulary from "@/data/vocabulary.json";
import type { VocabEntry } from "@/types/vocabulary";

const entries: VocabEntry[] = vocabulary as VocabEntry[];

export function getAllVocab(): VocabEntry[] {
  return entries;
}

export function getVocabById(id: string): VocabEntry | undefined {
  return entries.find((e) => e.id === id);
}

export function getVocabCount(): number {
  return entries.length;
}

/**
 * Pick a deterministic preview for SSR — same words appear each load until you
 * sign in and have personal progress. Indexes are chosen to feel curated.
 */
export function getHomePreviewVocab(): VocabEntry[] {
  const ids = ["climate", "net-zero"];
  return ids
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is VocabEntry => Boolean(e));
}
