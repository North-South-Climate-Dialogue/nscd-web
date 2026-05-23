import type { VocabEntry } from "@/types/vocabulary";

export type StatusFilter = "all" | "todo" | "done";
export type SortMode = "az" | "za" | "cat";

export interface GlossaryQuery {
  q: string;
  status: StatusFilter;
  cat: string;       // category slug, "" = all
  sort: SortMode;
}

export const DEFAULT_QUERY: GlossaryQuery = {
  q: "",
  status: "all",
  cat: "",
  sort: "az",
};

/** Slug a category name for use in URLs ("Basic Concept" → "basic-concept"). */
export function catSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Strip pinyin tone marks so "qi hou" matches "qì hòu". */
export function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function matchesQuery(entry: VocabEntry, q: string): boolean {
  if (!q) return true;
  const needle = stripDiacritics(q.toLowerCase());
  const haystack = stripDiacritics(
    [
      entry.word,
      entry.chineseTranslation,
      entry.pinyin,
      entry.description,
      entry.category,
    ]
      .join(" ")
      .toLowerCase(),
  );
  return haystack.includes(needle);
}

export function filterAndSort(
  entries: VocabEntry[],
  query: GlossaryQuery,
  learnedIds: Set<string>,
): VocabEntry[] {
  const out = entries.filter((e) => {
    if (!matchesQuery(e, query.q)) return false;
    if (query.cat && catSlug(e.category) !== query.cat) return false;
    if (query.status === "done" && !learnedIds.has(e.id)) return false;
    if (query.status === "todo" && learnedIds.has(e.id)) return false;
    return true;
  });

  switch (query.sort) {
    case "az":
      out.sort((a, b) => a.word.localeCompare(b.word, "en"));
      break;
    case "za":
      out.sort((a, b) => b.word.localeCompare(a.word, "en"));
      break;
    case "cat":
      out.sort((a, b) => {
        const c = a.category.localeCompare(b.category, "en");
        return c !== 0 ? c : a.word.localeCompare(b.word, "en");
      });
      break;
  }

  return out;
}
