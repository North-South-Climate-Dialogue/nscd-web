"use client";

import { CATEGORIES } from "@/types/vocabulary";
import { catSlug } from "@/lib/glossary/filters";

const FORMATS = [
  {
    tag: "填空 · Fill the blank",
    body: "A Chinese example sentence with the key term removed — pick the term that completes it.",
  },
  {
    tag: "配对 · Match",
    body: "A Chinese term with pinyin — match it to the right English word or definition.",
  },
  {
    tag: "组字 · Complete the phrase",
    body: "An English word and its Chinese phrase with one character missing — choose the character.",
  },
];

export default function QuizSetup({
  cat,
  available,
  roundSize,
  onChangeCat,
  onStart,
}: {
  cat: string;
  available: number;
  roundSize: number;
  onChangeCat: (v: string) => void;
  onStart: () => void;
}) {
  return (
    <section className="max-w-[840px] mx-auto px-6 md:px-8 py-12">
      <div className="border-2 border-ink bg-paper p-8 md:p-12 shadow-thunk-lg">
        <div className="label-mono text-coral mb-3.5">Set up your round</div>

        <h2 className="font-display font-extrabold text-ink text-[30px] md:text-[40px] leading-[0.95] tracking-tight normal-case max-w-[22ch]">
          Three ways to test what you know.
        </h2>
        <p className="mt-4 max-w-[58ch] text-[16px] leading-[1.6] text-ink/80">
          Each round mixes the question types below at random. Get one right and
          the term is added to your learned list.
        </p>

        {/* Question-type explainer */}
        <ol className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-3">
          {FORMATS.map((f, i) => (
            <li
              key={f.tag}
              className="border-2 border-ink bg-paper p-4 flex flex-col gap-2"
            >
              <span className="font-display font-extrabold text-coral text-[22px] leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="label-mono text-sage">{f.tag}</span>
              <span className="text-ink/80 text-[13px] leading-[1.5]">
                {f.body}
              </span>
            </li>
          ))}
        </ol>

        {/* Category */}
        <div className="mt-9 max-w-[420px]">
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

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div className="label-mono text-sage">
            Ready ·{" "}
            <span className="text-ink font-semibold">{roundSize}</span>{" "}
            question{roundSize === 1 ? "" : "s"} from{" "}
            <span className="text-ink font-semibold">{available}</span>{" "}
            available term{available === 1 ? "" : "s"}
          </div>
          <button
            type="button"
            onClick={onStart}
            disabled={roundSize === 0}
            className="bg-coral border-2 border-ink px-7 py-4 font-extrabold uppercase tracking-[0.1em] text-[15px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-thunk"
          >
            Start the quiz →
          </button>
        </div>

        {roundSize === 0 && (
          <p className="mt-4 label-mono text-coral">
            No terms in this category. Pick another to start.
          </p>
        )}
      </div>
    </section>
  );
}
