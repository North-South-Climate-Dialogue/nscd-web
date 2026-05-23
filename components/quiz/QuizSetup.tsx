"use client";

import { CATEGORIES } from "@/types/vocabulary";
import { catSlug } from "@/lib/glossary/filters";

export const ROUND_LENGTHS = [5, 10, 20, 0] as const; // 0 = All
export type RoundLength = (typeof ROUND_LENGTHS)[number];

export default function QuizSetup({
  cat,
  length,
  available,
  onChangeCat,
  onChangeLength,
  onStart,
}: {
  cat: string;
  length: RoundLength;
  available: number;
  onChangeCat: (v: string) => void;
  onChangeLength: (v: RoundLength) => void;
  onStart: () => void;
}) {
  const effective = length === 0 ? available : Math.min(length, available);

  return (
    <section className="max-w-[840px] mx-auto px-6 md:px-8 py-12">
      <div className="border-2 border-ink bg-paper p-8 md:p-12 shadow-thunk-lg">
        <div className="label-mono text-coral mb-3.5">Set up your round</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
          {/* Category */}
          <div>
            <label className="label-mono text-sage block mb-3">Category</label>
            <select
              value={cat}
              onChange={(e) => onChangeCat(e.target.value)}
              className="w-full appearance-none border-2 border-ink bg-paper px-4 py-3 text-[14px] font-semibold uppercase tracking-[0.08em] outline-none cursor-pointer"
              aria-label="Filter quiz by category"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={catSlug(c)}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Length */}
          <div>
            <label className="label-mono text-sage block mb-3">Round length</label>
            <div role="radiogroup" aria-label="Round length" className="grid grid-cols-4 border-2 border-ink">
              {ROUND_LENGTHS.map((n, i) => {
                const active = length === n;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onChangeLength(n)}
                    className={`px-2 py-3 text-[13px] font-extrabold uppercase tracking-[0.08em] transition-colors ${
                      i > 0 ? "border-l-2 border-ink" : ""
                    } ${active ? "bg-coral text-ink" : "bg-paper text-ink hover:bg-paper/70"}`}
                  >
                    {n === 0 ? "All" : n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div className="label-mono text-sage">
            Ready ·{" "}
            <span className="text-ink font-semibold">{effective}</span>{" "}
            question{effective === 1 ? "" : "s"} from{" "}
            <span className="text-ink font-semibold">
              {available}
            </span>{" "}
            available term{available === 1 ? "" : "s"}
          </div>
          <button
            type="button"
            onClick={onStart}
            disabled={effective === 0}
            className="bg-coral border-2 border-ink px-7 py-4 font-extrabold uppercase tracking-[0.1em] text-[15px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-thunk"
          >
            Start the quiz →
          </button>
        </div>

        {effective === 0 && (
          <p className="mt-4 label-mono text-coral">
            No terms in this category. Pick another to start.
          </p>
        )}
      </div>
    </section>
  );
}
