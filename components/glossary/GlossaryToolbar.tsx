"use client";

import { CATEGORIES } from "@/types/vocabulary";
import { catSlug, type GlossaryQuery, type SortMode, type StatusFilter } from "@/lib/glossary/filters";

export default function GlossaryToolbar({
  query,
  totalCount,
  filteredCount,
  onChange,
  onClearAll,
}: {
  query: GlossaryQuery;
  totalCount: number;
  filteredCount: number;
  onChange: (next: Partial<GlossaryQuery>) => void;
  onClearAll: () => void;
}) {
  const hasFilters =
    query.q !== "" ||
    query.status !== "all" ||
    query.cat !== "" ||
    query.sort !== "az";

  return (
    <div className="sticky top-0 z-20 bg-paper border-y-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] items-stretch gap-3">
          {/* Search */}
          <div className="relative flex items-center border-2 border-ink bg-paper">
            <span aria-hidden className="pl-3 text-ink/60 text-lg">⌕</span>
            <input
              type="search"
              value={query.q}
              onChange={(e) => onChange({ q: e.target.value })}
              placeholder="Search English, 中文, pinyin, or definition…"
              className="w-full bg-transparent px-3 py-2.5 text-[15px] text-ink placeholder:text-ink/40 outline-none"
              aria-label="Search the glossary"
            />
            {query.q && (
              <button
                type="button"
                onClick={() => onChange({ q: "" })}
                aria-label="Clear search"
                className="px-3 py-2.5 text-ink/60 hover:text-coral text-sm border-l-2 border-ink/15"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status segmented control */}
          <div role="radiogroup" aria-label="Status filter" className="flex border-2 border-ink">
            {(
              [
                { value: "all",  label: "All" },
                { value: "todo", label: "Not yet" },
                { value: "done", label: "Learned" },
              ] satisfies { value: StatusFilter; label: string }[]
            ).map((opt, i) => {
              const active = query.status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ status: opt.value })}
                  className={`px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    i > 0 ? "border-l-2 border-ink" : ""
                  } ${
                    active
                      ? "bg-coral text-ink"
                      : "bg-paper text-ink hover:bg-paper/70"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Category dropdown */}
          <label className="flex items-center border-2 border-ink bg-paper">
            <span className="label-mono text-sage pl-3 pr-2">Category</span>
            <select
              value={query.cat}
              onChange={(e) => onChange({ cat: e.target.value })}
              className="appearance-none bg-transparent pr-3 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] outline-none cursor-pointer"
              aria-label="Filter by category"
            >
              <option value="">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={catSlug(c)}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Sort dropdown */}
          <label className="flex items-center border-2 border-ink bg-paper">
            <span className="label-mono text-sage pl-3 pr-2">Sort</span>
            <select
              value={query.sort}
              onChange={(e) => onChange({ sort: e.target.value as SortMode })}
              className="appearance-none bg-transparent pr-3 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] outline-none cursor-pointer"
              aria-label="Sort order"
            >
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="cat">By Category</option>
            </select>
          </label>
        </div>

        {/* Result count + clear all */}
        <div className="mt-3 flex items-center justify-between label-mono text-sage">
          <span>
            Showing{" "}
            <span className="text-ink font-semibold">
              {filteredCount}
            </span>{" "}
            of {totalCount} terms
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="font-sans font-extrabold uppercase tracking-[0.1em] text-[15px] text-coral border-b-2 border-coral pb-0.5 hover:text-ink hover:border-ink transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
