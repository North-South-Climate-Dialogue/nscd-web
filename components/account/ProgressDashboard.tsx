"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { VocabEntry } from "@/types/vocabulary";
import { useProgress } from "@/hooks/useProgress";
import {
  readProgressRows,
  learnedByCategory,
  recentActivity,
  relativeDate,
  resetProgress,
} from "@/lib/progress/derived";
import { onProgressChanged } from "@/lib/progress/local";

export default function ProgressDashboard({
  entries,
}: {
  entries: VocabEntry[];
}) {
  const { learnedIds } = useProgress();
  const total = entries.length;
  const learned = learnedIds.size;
  const pct = total === 0 ? 0 : Math.round((learned / total) * 100);

  // Re-derive activity rows on storage changes (useProgress only gives us IDs).
  const [version, setVersion] = useState(0);
  useEffect(() => onProgressChanged(() => setVersion((v) => v + 1)), []);
  const rows = (() => {
    void version;
    return readProgressRows();
  })();

  const byCategory = learnedByCategory(entries, learnedIds);
  const recent = recentActivity(rows, entries, 10);

  // Sort entries by category, then alphabetical, so the heat-grid groups visually.
  const sortedEntries = [...entries].sort((a, b) => {
    const c = a.category.localeCompare(b.category, "en");
    return c !== 0 ? c : a.word.localeCompare(b.word, "en");
  });

  function handleReset() {
    if (typeof window === "undefined") return;
    if (window.confirm("Reset all progress on this device? This cannot be undone.")) {
      resetProgress();
    }
  }

  return (
    <div className="space-y-7 min-w-0">
      {/* Big stat */}
      <article className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0">
        <div className="label-mono text-coral mb-3">Overall</div>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <div className="font-display font-extrabold text-ink text-[80px] md:text-[112px] leading-[0.9]">
            {learned}
          </div>
          <div className="text-sage font-display font-extrabold text-[40px] md:text-[56px] leading-none">
            / {total}
          </div>
          <div className="font-mono text-ink/70 text-[14px] ml-auto">
            {pct}% complete
          </div>
        </div>
        <div className="mt-5 h-2 w-full bg-ink/15 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-coral transition-[width] duration-500"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
        </div>
        <div className="mt-2 label-mono text-sage normal-case tracking-normal text-[12px]">
          Progress is saved locally on this device.
        </div>
      </article>

      {/* Heat grid */}
      <article className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0">
        <div className="label-mono text-coral mb-3">Map · all 149 terms</div>
        <h2 className="font-display font-extrabold text-ink text-[24px] md:text-[30px] leading-tight tracking-tight normal-case">
          Every word at a glance.
        </h2>
        <p className="mt-3 text-ink/75 text-[15px] leading-[1.55] max-w-[60ch]">
          Coral squares are words you&apos;ve mastered. Hover to peek; click to
          jump to it in the glossary.
        </p>

        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(22px,1fr))] gap-1">
          {sortedEntries.map((e) => {
            const done = learnedIds.has(e.id);
            return (
              <Link
                key={e.id}
                href={`/learning/glossary?sel=${e.id}`}
                title={`${e.word} · ${e.chineseTranslation}${done ? " · learned" : ""}`}
                aria-label={`${e.word} ${done ? "(learned)" : "(not yet)"}`}
                className={`block aspect-square border border-ink/40 transition-transform hover:scale-110 hover:border-ink ${
                  done ? "bg-coral" : "bg-paper"
                }`}
              />
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 label-mono text-sage normal-case tracking-normal text-[12px]">
          <span className="flex items-center gap-2">
            <span className="block w-3.5 h-3.5 bg-coral border border-ink" />
            Mastered
          </span>
          <span className="flex items-center gap-2">
            <span className="block w-3.5 h-3.5 bg-paper border border-ink" />
            Not yet
          </span>
        </div>
      </article>

      {/* Per-category */}
      <article className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0">
        <div className="label-mono text-coral mb-3">By category</div>
        <h2 className="font-display font-extrabold text-ink text-[24px] md:text-[30px] leading-tight tracking-tight normal-case">
          Where you&apos;re strongest.
        </h2>

        <ul className="mt-6 space-y-3">
          {byCategory.map((row) => {
            const pct = row.total === 0 ? 0 : Math.round((row.learned / row.total) * 100);
            return (
              <li key={row.category}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span
                    className="font-display font-extrabold text-ink text-[16px] md:text-[18px] leading-tight tracking-tight normal-case"
                    style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                  >
                    {row.category}
                  </span>
                  <span className="ml-auto font-mono text-ink/70 text-[13px]">
                    {row.learned} / {row.total}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-ink/15 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-coral transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                    aria-hidden
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </article>

      {/* Recent activity */}
      <article className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0">
        <div className="label-mono text-coral mb-3">Recent activity</div>
        <h2 className="font-display font-extrabold text-ink text-[24px] md:text-[30px] leading-tight tracking-tight normal-case">
          The last words you learned.
        </h2>

        {recent.length === 0 ? (
          <p className="mt-5 text-ink/70 text-[15px]">
            Nothing yet. Mark a word as learned in the{" "}
            <Link
              href="/learning/glossary"
              className="text-coral border-b-2 border-coral hover:text-ink hover:border-ink transition-colors"
            >
              glossary
            </Link>{" "}
            and it&apos;ll show up here.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-ink/15">
            {recent.map(({ entry, completed_at }) => (
              <li key={entry.id} className="py-3.5 first:pt-0 last:pb-0">
                <Link
                  href={`/learning/glossary?sel=${entry.id}`}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 hover:text-coral transition-colors"
                >
                  <span
                    className="font-display font-extrabold text-ink text-[18px] md:text-[20px] leading-tight tracking-tight normal-case group-hover:text-coral"
                    style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                  >
                    {entry.word}
                  </span>
                  <span className="font-zh font-medium text-green-deep text-[15px] leading-tight">
                    {entry.chineseTranslation}
                  </span>
                  <span className="ml-auto label-mono text-sage normal-case tracking-normal text-[12px]">
                    {relativeDate(completed_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>

      {/* Danger zone */}
      <article className="border-2 border-dashed border-ink/40 bg-paper p-6 md:p-7 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="label-mono text-coral mb-1">Reset progress</div>
            <p className="text-ink/75 text-[14px] leading-[1.55] max-w-[58ch]">
              Clear the local learned-words list on this device. The glossary
              and your goals stay intact — only the &quot;learned&quot; status
              gets reset.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="border-2 border-ink bg-paper px-5 py-3 font-extrabold uppercase tracking-[0.1em] text-[13px] text-ink hover:bg-ink hover:text-paper transition-colors shrink-0"
          >
            Reset
          </button>
        </div>
      </article>
    </div>
  );
}
