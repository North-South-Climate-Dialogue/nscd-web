"use client";

import { forwardRef } from "react";
import type { VocabEntry } from "@/types/vocabulary";
import CategoryTag from "./CategoryTag";

/**
 * Single glossary row — card-like, multi-line, vertically stacked.
 * Clicking (or Enter / Space) opens the detail panel via onSelect.
 * Forwards its ref so the parent can manage focus + scroll-into-view.
 */
interface Props {
  entry: VocabEntry;
  index: number;
  learned: boolean;
  selected: boolean;
  onSelect: () => void;
}

const GlossaryRow = forwardRef<HTMLElement, Props>(function GlossaryRow(
  { entry, index, learned, selected, onSelect },
  ref,
) {
  return (
    <article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group grid grid-cols-[28px_1fr_auto] gap-x-5 items-start px-6 py-6 border-b border-ink/15 cursor-pointer transition-[padding,border-color,background] focus:outline-none focus:bg-[#FAF6EC] focus:border-l-4 focus:border-l-coral focus:pl-5 hover:bg-[#FAF6EC] hover:border-l-4 hover:border-l-coral hover:pl-5 ${
        selected ? "bg-[#FAF6EC] border-l-4 border-l-coral pl-5" : ""
      }`}
    >
      {/* Status dot */}
      <div className="pt-2">
        <span
          aria-label={learned ? "Learned" : "Not yet"}
          className={`block w-3.5 h-3.5 rounded-full border-2 border-ink ${
            learned ? "bg-coral" : "bg-transparent"
          }`}
        />
      </div>

      {/* Main content */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h3 className="font-display font-extrabold text-ink text-[24px] sm:text-[26px] md:text-[30px] leading-tight tracking-tight normal-case">
            {entry.word}
          </h3>
          <span className="text-ink/30 select-none hidden md:inline">·</span>
          <span className="font-zh font-medium text-green-deep text-lg md:text-xl leading-tight">
            {entry.chineseTranslation}
          </span>
          {entry.pinyin && (
            <span className="font-sans italic text-sage text-[15px] md:text-base leading-tight">
              {entry.pinyin}
            </span>
          )}
          <div className="md:ml-auto md:self-center w-full md:w-auto">
            <CategoryTag category={entry.category} />
          </div>
        </div>

        <p className="mt-3 text-ink/85 text-[15px] md:text-base leading-[1.6] max-w-[80ch]">
          {entry.description}
        </p>
      </div>

      {/* Index + chevron */}
      <div className="flex flex-col items-end justify-between gap-3 pt-1.5 min-h-full">
        <span className="font-mono text-[11px] text-sage hidden md:inline">
          {String(index + 1).padStart(3, "0")}
        </span>
        <span
          className={`transition-colors text-2xl leading-none ${
            selected ? "text-coral" : "text-ink/40 group-hover:text-coral"
          }`}
          aria-hidden
        >
          →
        </span>
      </div>
    </article>
  );
});

export default GlossaryRow;
