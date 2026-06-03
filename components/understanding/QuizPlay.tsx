"use client";

import type { QuizQuestion } from "@/lib/quiz/understanding";
import CategoryTag from "@/components/glossary/CategoryTag";

export default function QuizPlay({
  question,
  position,
  total,
  elapsedSec,
  chosenIndex,        // null = not answered yet
  onChoose,
  onNext,
  isLast,
}: {
  question: QuizQuestion;
  position: number;
  total: number;
  elapsedSec: number;
  chosenIndex: number | null;
  onChoose: (i: number) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const answered = chosenIndex !== null;
  const correctIndex = question.choices.findIndex((c) => c.correct);

  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ss = String(elapsedSec % 60).padStart(2, "0");

  return (
    <section className="max-w-[820px] mx-auto px-6 md:px-8 py-10">
      {/* Top bar — position, timer, progress */}
      <div className="flex items-center gap-3 label-mono text-sage mb-3">
        <span>
          Question{" "}
          <span className="text-ink font-semibold">
            {String(position).padStart(2, "0")}
          </span>{" "}
          / {total}
        </span>
        <div className="flex-1 h-1.5 bg-ink/15 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-coral transition-[width] duration-300"
            style={{ width: `${Math.round(((position - 1) / total) * 100)}%` }}
            aria-hidden
          />
        </div>
        <span className="font-mono text-ink">
          {mm}:{ss}
        </span>
      </div>

      {/* Prompt card */}
      <article className="border-2 border-ink bg-paper p-8 md:p-10 shadow-thunk-lg">
        <div className="flex items-start justify-between gap-4">
          <CategoryTag category={question.entry.category} />
          <span className="label-mono text-sage">Which definition matches?</span>
        </div>

        <h2 className="mt-6 font-display font-extrabold text-ink text-[44px] md:text-[60px] leading-[1] tracking-tight normal-case break-words">
          {question.entry.word}
        </h2>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-zh font-bold text-green-deep text-[32px] md:text-[40px] leading-none">
            {question.entry.chineseTranslation}
          </span>
          {question.entry.pinyin && (
            <span className="font-sans italic text-sage text-lg">
              {question.entry.pinyin}
            </span>
          )}
        </div>
      </article>

 {/* Choices */}
<div className="mt-6 grid grid-cols-1 gap-3 overflow-visible">
  {question.choices.map((c, i) => {
    const isChosen = chosenIndex === i;
    const isCorrect = answered && i === correctIndex;
    const isWrongChosen = answered && isChosen && !c.correct;

    const tone = !answered
      ? "bg-paper text-ink hover:bg-[#FAF6EC] hover:border-l-4 hover:border-l-coral hover:pl-5"
      : isCorrect
        ? "bg-green text-paper border-green"
        : isWrongChosen
          ? "bg-coral text-ink"
          : "bg-paper text-ink opacity-60";

    return (
      <button
        key={i}
        type="button"
        onClick={() => !answered && onChoose(i)}
        disabled={answered}
        className={`block w-full h-auto text-left border-2 border-ink px-5 py-5 md:px-6 md:py-6 transition-all whitespace-normal break-words overflow-visible [overflow-wrap:anywhere] [text-overflow:clip] ${
          !answered ? "cursor-pointer" : "cursor-default"
        } ${tone}`}
      >
        <div className="flex w-full min-w-0 items-start gap-3 md:gap-5 overflow-visible">
          <span
            className={`font-display font-extrabold text-[28px] leading-none w-10 min-w-[2.5rem] aspect-square border-2 border-current inline-flex items-center justify-center shrink-0 ${
              !answered ? "text-coral border-ink" : ""
            }`}
            aria-hidden
          >
            {"ABC"[i]}
          </span>

          <span className="block flex-1 min-w-0 whitespace-normal break-words text-[15px] md:text-[17px] leading-[1.7] [overflow-wrap:anywhere] [text-overflow:clip] overflow-visible">
            {c.text}
          </span>
        </div>
      </button>
    );
  })}
</div>

      {/* Feedback row + next */}
      {answered && (
        <div className="mt-6 border-2 border-ink bg-paper p-5 md:p-6 shadow-thunk-lg">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="label-mono text-coral mb-1">
                {chosenIndex === correctIndex ? "Correct" : "Not quite"}
              </div>
              <p className="text-ink text-[15px] leading-[1.55]">
                {chosenIndex === correctIndex
                  ? "Nicely done. This word is now in your learned list."
                  : "The correct definition is highlighted above. Keep going — you'll see this word again."}
              </p>
              {question.entry.example && (
                <div className="mt-3 border-l-2 border-ink/30 pl-3 space-y-1.5">
                  <p className="font-zh text-ink/85 text-[15px] leading-[1.7]">
                    {question.entry.example}
                  </p>
                  {question.entry.exampleEnglish && (
                    <p className="text-ink/70 text-[13px] md:text-[14px] leading-[1.55] italic">
                      {question.entry.exampleEnglish}
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onNext}
              className="bg-ink text-paper border-2 border-ink px-6 py-3.5 font-extrabold uppercase tracking-[0.1em] text-[14px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#23492A] transition-all"
            >
              {isLast ? "See results →" : "Next question →"}
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 label-mono text-sage text-center">
        Keys · 1 2 3 to choose · Enter to advance
      </p>
    </section>
  );
}
