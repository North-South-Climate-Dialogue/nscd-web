"use client";

import Link from "next/link";

export default function FlashcardDone({
  mastered,
  total,
  onRestart,
}: {
  mastered: number;
  total: number;
  onRestart: () => void;
}) {
  const pct = total === 0 ? 0 : Math.round((mastered / total) * 100);
  return (
    <section className="max-w-[840px] mx-auto px-8 py-16 text-center">
      <div className="border-2 border-ink bg-paper p-10 md:p-14 shadow-thunk-lg">
        <div className="label-mono text-coral mb-3">Deck complete</div>
        <h2 className="font-display font-extrabold text-ink text-[48px] md:text-[80px] leading-[0.95] tracking-tight">
          Well done.
        </h2>
        <p className="mt-5 max-w-[44ch] mx-auto text-ink/80 text-[17px] leading-[1.55]">
          You reached the end of this deck. You mastered{" "}
          <span className="text-coral font-bold">{mastered}</span> of{" "}
          <span className="font-bold">{total}</span> cards in this round —
          that&apos;s {pct}% of the deck.
        </p>

        <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="bg-coral border-2 border-ink px-5 py-4 font-extrabold uppercase tracking-[0.08em] text-[14px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
          >
            ↻ Start over
          </button>
          <Link
            href="/learning/glossary"
            className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.08em] text-[14px] hover:bg-ink hover:text-paper transition-colors"
          >
            Back to glossary →
          </Link>
        </div>
      </div>
    </section>
  );
}
