"use client";

import { CATEGORIES } from "@/types/vocabulary";
import { catSlug } from "@/lib/glossary/filters";
import type { FlipDirection } from "./Flashcard";

export default function FlashcardToolbar({
  cat,
  direction,
  onChangeCat,
  onChangeDirection,
  onReshuffle,
}: {
  cat: string;
  direction: FlipDirection;
  onChangeCat: (v: string) => void;
  onChangeDirection: (v: FlipDirection) => void;
  onReshuffle: () => void;
}) {
  return (
    <div className="sticky top-0 z-20 bg-paper border-y-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_auto_1fr_auto] items-stretch gap-3">
          {/* Category */}
          <label className="flex items-center border-2 border-ink bg-paper">
            <span className="label-mono text-sage pl-3 pr-2">Category</span>
            <select
              value={cat}
              onChange={(e) => onChangeCat(e.target.value)}
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

          {/* Direction */}
          <div role="radiogroup" aria-label="Card direction" className="flex border-2 border-ink">
            {(
              [
                { value: "en-to-zh", label: "EN → 中文" },
                { value: "zh-to-en", label: "中文 → EN" },
              ] satisfies { value: FlipDirection; label: string }[]
            ).map((opt, i) => {
              const active = direction === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChangeDirection(opt.value)}
                  className={`px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    i > 0 ? "border-l-2 border-ink" : ""
                  } ${active ? "bg-coral text-ink" : "bg-paper text-ink hover:bg-paper/70"}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div /> {/* spacer */}

          {/* Reshuffle */}
          <button
            type="button"
            onClick={onReshuffle}
            className="border-2 border-ink bg-paper px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-ink hover:text-paper transition-colors"
          >
            ↻ Reshuffle
          </button>
        </div>
      </div>
    </div>
  );
}
