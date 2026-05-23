"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { VocabEntry } from "@/types/vocabulary";
import {
  DEFAULT_QUERY,
  filterAndSort,
  type GlossaryQuery,
  type SortMode,
  type StatusFilter,
} from "@/lib/glossary/filters";
import { useProgress } from "@/hooks/useProgress";
import GlossaryToolbar from "./GlossaryToolbar";
import GlossaryRow from "./GlossaryRow";
import GlossaryDetail from "./GlossaryDetail";

const VALID_STATUS: ReadonlySet<StatusFilter> = new Set(["all", "todo", "done"]);
const VALID_SORT: ReadonlySet<SortMode> = new Set(["az", "za", "cat"]);

export default function GlossaryBrowser({ entries }: { entries: VocabEntry[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { learnedIds, toggle } = useProgress();

  const query: GlossaryQuery = useMemo(() => {
    const status = searchParams.get("status") as StatusFilter | null;
    const sort = searchParams.get("sort") as SortMode | null;
    return {
      q: searchParams.get("q") ?? "",
      status: status && VALID_STATUS.has(status) ? status : DEFAULT_QUERY.status,
      cat: searchParams.get("cat") ?? "",
      sort: sort && VALID_SORT.has(sort) ? sort : DEFAULT_QUERY.sort,
    };
  }, [searchParams]);

  const selectedId = searchParams.get("sel") ?? "";

  const writeAllParams = useCallback(
    (next: GlossaryQuery, sel: string) => {
      const params = new URLSearchParams();
      if (next.q) params.set("q", next.q);
      if (next.status !== DEFAULT_QUERY.status) params.set("status", next.status);
      if (next.cat) params.set("cat", next.cat);
      if (next.sort !== DEFAULT_QUERY.sort) params.set("sort", next.sort);
      if (sel) params.set("sel", sel);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const handleChange = useCallback(
    (patch: Partial<GlossaryQuery>) => writeAllParams({ ...query, ...patch }, selectedId),
    [query, selectedId, writeAllParams],
  );

  const handleClearAll = useCallback(
    () => writeAllParams(DEFAULT_QUERY, selectedId),
    [selectedId, writeAllParams],
  );

  const setSelected = useCallback(
    (id: string) => writeAllParams(query, id),
    [query, writeAllParams],
  );

  const filtered = useMemo(
    () => filterAndSort(entries, query, learnedIds),
    [entries, query, learnedIds],
  );

  const selectedEntry = useMemo(
    () => entries.find((e) => e.id === selectedId) ?? null,
    [entries, selectedId],
  );

  const selectedIndex = useMemo(
    () => (selectedEntry ? filtered.findIndex((e) => e.id === selectedEntry.id) : -1),
    [filtered, selectedEntry],
  );

  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  rowRefs.current = [];

  // Track the row that opened the panel so we can restore focus on close.
  const focusTriggerRef = useRef<HTMLElement | null>(null);

  // Scroll the currently selected row into view (used when stepping prev/next
  // inside the detail panel — keeps the underlying list aligned with the panel).
  useEffect(() => {
    if (selectedIndex < 0) return;
    const el = rowRefs.current[selectedIndex];
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  // Arrow-key navigation through the list when no panel is open.
  useEffect(() => {
    if (selectedId) return; // panel handles its own keys
    function handler(e: KeyboardEvent) {
      const isNavKey = ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key);
      if (!isNavKey) return;

      // Don't hijack arrow keys while typing in an input/select/textarea.
      const ae = document.activeElement as HTMLElement | null;
      if (ae) {
        const tag = ae.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        if (ae.isContentEditable) return;
      }

      let currentIndex = -1;
      rowRefs.current.forEach((el, i) => {
        if (el && (el === ae || el.contains(ae))) currentIndex = i;
      });

      let nextIndex = currentIndex;
      if (e.key === "ArrowDown") {
        nextIndex = currentIndex < 0 ? 0 : Math.min(filtered.length - 1, currentIndex + 1);
      } else if (e.key === "ArrowUp") {
        nextIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = filtered.length - 1;
      }

      const target = rowRefs.current[nextIndex];
      if (target && nextIndex !== currentIndex) {
        e.preventDefault();
        target.focus();
        target.scrollIntoView({ block: "nearest" });
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtered.length, selectedId]);

  const handleSelectRow = useCallback(
    (entryId: string, index: number) => {
      focusTriggerRef.current = rowRefs.current[index];
      setSelected(entryId);
    },
    [setSelected],
  );

  const handlePrev = useCallback(() => {
    if (filtered.length === 0) return;
    const i = selectedIndex < 0 ? 0 : (selectedIndex - 1 + filtered.length) % filtered.length;
    setSelected(filtered[i].id);
  }, [filtered, selectedIndex, setSelected]);

  const handleNext = useCallback(() => {
    if (filtered.length === 0) return;
    const i = selectedIndex < 0 ? 0 : (selectedIndex + 1) % filtered.length;
    setSelected(filtered[i].id);
  }, [filtered, selectedIndex, setSelected]);

  const handleCloseDetail = useCallback(() => {
    const restore = focusTriggerRef.current;
    writeAllParams(query, "");
    // Restore focus to the row that opened the panel.
    setTimeout(() => restore?.focus(), 0);
  }, [query, writeAllParams]);

  const handleToggleLearned = useCallback(() => {
    if (selectedEntry) void toggle(selectedEntry.id);
  }, [selectedEntry, toggle]);

  return (
    <>
      <GlossaryToolbar
        query={query}
        totalCount={entries.length}
        filteredCount={filtered.length}
        onChange={handleChange}
        onClearAll={handleClearAll}
      />

      {/* Screen-reader announcement of result-count changes */}
      <div role="status" aria-live="polite" className="sr-only">
        Showing {filtered.length} of {entries.length} terms.
      </div>

      <section className="max-w-[1200px] mx-auto px-8 py-10">
        {filtered.length === 0 ? (
          <EmptyState onClear={handleClearAll} hasQuery={query.q.length > 0} />
        ) : (
          <>
            <div className="border-2 border-ink bg-paper shadow-thunk-lg">
              {filtered.map((entry, i) => (
                <GlossaryRow
                  key={entry.id}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  entry={entry}
                  index={i}
                  learned={learnedIds.has(entry.id)}
                  selected={entry.id === selectedId}
                  onSelect={() => handleSelectRow(entry.id, i)}
                />
              ))}
            </div>

            {/* Keyboard hint */}
            <p className="mt-4 label-mono text-sage text-center">
              Tip · use ↑ ↓ to move, Enter to open
            </p>

            <p className="mt-3 label-mono text-sage text-center">
              End of results · {filtered.length} of {entries.length} terms
            </p>
          </>
        )}
      </section>

      <GlossaryDetail
        entry={selectedEntry}
        position={selectedIndex >= 0 ? selectedIndex + 1 : 0}
        total={filtered.length}
        learned={selectedEntry ? learnedIds.has(selectedEntry.id) : false}
        onClose={handleCloseDetail}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleLearned={handleToggleLearned}
      />
    </>
  );
}

function EmptyState({
  onClear,
  hasQuery,
}: {
  onClear: () => void;
  hasQuery: boolean;
}) {
  return (
    <div className="border-2 border-dashed border-ink/40 bg-paper p-8 md:p-14 text-center shadow-thunk-lg">
      <div className="font-display font-extrabold text-ink text-[48px] md:text-[80px] leading-[0.95] tracking-tight">
        {hasQuery ? "Nothing matches that." : "No terms here yet."}
      </div>
      <p className="mt-5 max-w-[52ch] mx-auto text-ink/75 text-[16px] leading-[1.55]">
        {hasQuery
          ? "Try a different search term, broaden the category, or clear everything to start over."
          : "The current filters left nothing on the page. Clear them to see every term again."}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-7 inline-block bg-coral border-2 border-ink px-6 py-3.5 font-extrabold uppercase tracking-[0.1em] text-[14px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
      >
        Clear all filters
      </button>
    </div>
  );
}
