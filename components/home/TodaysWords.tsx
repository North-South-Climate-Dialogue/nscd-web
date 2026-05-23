import Link from "next/link";
import { getHomePreviewVocab, getVocabCount } from "@/lib/vocabulary";

export default function TodaysWords() {
  const preview = getHomePreviewVocab();
  const total = getVocabCount();

  return (
    <section className="py-24">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="label-mono text-green-deep mb-3.5">Today's lesson</div>
        <h2 className="display text-green-deep text-[48px] md:text-[72px] leading-[0.95] max-w-[14ch]">
          The vocabulary that builds a movement.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {preview.map((entry, idx) => (
            <article
              key={entry.id}
              className="bg-paper border-[3px] border-ink p-7 shadow-thunk-lg"
            >
              <span
                className={`inline-block ${
                  idx === 0 ? "bg-green text-paper" : "bg-coral text-ink"
                } px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] mb-3`}
              >
                {idx === 0 ? "Featured" : "New"}
              </span>
              <div className="display text-green-deep text-[48px] leading-none">
                {entry.word}
              </div>
              <div className="font-zh text-coral text-[32px] font-bold mt-1">
                {entry.chineseTranslation}
              </div>
              <p className="text-base text-ink mt-3.5 leading-[1.55]">
                {entry.description}
              </p>
              <div className="mt-3.5 pt-3.5 border-t-2 border-dashed border-ink space-y-1">
                <p className="font-zh text-sm text-sage">
                  {entry.example}
                </p>
                {entry.exampleEnglish && (
                  <p className="text-[12px] text-sage/85 italic leading-[1.55]">
                    {entry.exampleEnglish}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center mt-4.5 pt-4 mt-4">
                <span className="font-mono text-[12px] text-sage">
                  {String(idx + 1).padStart(2, "0")} / {total}
                </span>
                <Link
                  href={`/learning/glossary#${entry.id}`}
                  className="bg-green text-paper border-2 border-ink px-4 py-2.5 font-bold uppercase tracking-[0.08em] text-[12px] hover:bg-green-deep transition-colors"
                >
                  {idx === 0 ? "Review" : "Learn"}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <p className="text-ink text-base max-w-[40ch]">
            All {total} climate terms — definitions, bilingual examples, and a quiz mode — are in the glossary.
          </p>
          <Link
            href="/learning/glossary"
            className="bg-ink text-paper border-2 border-ink px-6 py-3.5 font-bold uppercase tracking-[0.08em] text-[14px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#23492A] transition-all"
          >
            Open the glossary →
          </Link>
        </div>
      </div>
    </section>
  );
}
