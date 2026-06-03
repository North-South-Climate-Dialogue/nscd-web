"use client";

import type { QuizQuestion } from "@/lib/quiz/build";
import CategoryTag from "@/components/glossary/CategoryTag";

export default function QuizPlay({
  question,
  position,
  total,
  elapsedSec,
  chosenIndex, // null = not answered yet
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
          <span className="label-mono text-sage">{promptKicker(question)}</span>
        </div>
        <div className="mt-6">
          <Prompt question={question} />
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
              <div className="flex w-full min-w-0 items-center gap-3 md:gap-5 overflow-visible">
                <span
                  className={`font-display font-extrabold text-[28px] leading-none w-10 min-w-[2.5rem] aspect-square border-2 border-current inline-flex items-center justify-center shrink-0 ${
                    !answered ? "text-coral border-ink" : ""
                  }`}
                  aria-hidden
                >
                  {"ABC"[i]}
                </span>

                <ChoiceText style={question.choiceStyle} text={c.text} />
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

              {/* Always reveal the full term so every type teaches the word */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display font-extrabold text-ink text-[20px] md:text-[24px] leading-tight normal-case">
                  {question.entry.word}
                </span>
                <span className="font-zh font-bold text-green-deep text-[18px] md:text-[22px] leading-tight">
                  {question.entry.chineseTranslation}
                </span>
                {question.entry.pinyin && (
                  <span className="font-sans italic text-sage text-sm md:text-base">
                    {question.entry.pinyin}
                  </span>
                )}
              </div>

              <p className="mt-2 text-ink/85 text-[15px] leading-[1.55]">
                {question.entry.description}
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

/* ── Prompt kicker (top-right caption) ─────────────────────────────────── */
function promptKicker(q: QuizQuestion): string {
  switch (q.type) {
    case "fill-blank":
      return "Fill in the blank · 填空";
    case "char-pick":
      return "Complete the phrase · 组字";
    case "match":
    default:
      return q.matchTarget === "word"
        ? "Match the term · 配对"
        : "Match the meaning · 配对";
  }
}

/* ── Prompt body, by type ──────────────────────────────────────────────── */
function Prompt({ question: q }: { question: QuizQuestion }) {
  const blank = (
    <span className="inline-block align-baseline mx-1 min-w-[2.4em] border-b-[3px] border-coral text-coral text-center font-extrabold">
      ？
    </span>
  );

  if (q.type === "fill-blank") {
    return (
      <div>
        <p className="font-zh font-bold text-ink text-[26px] md:text-[34px] leading-[1.5] break-words">
          {q.sentenceBefore}
          {blank}
          {q.sentenceAfter}
        </p>
        {q.entry.exampleEnglish && (
          <p className="mt-4 text-ink/55 text-[14px] md:text-[15px] leading-[1.55] italic">
            {q.entry.exampleEnglish}
          </p>
        )}
        <p className="mt-4 label-mono text-sage">
          Which term fills the blank?
        </p>
      </div>
    );
  }

  if (q.type === "char-pick") {
    return (
      <div>
        <h2 className="font-display font-extrabold text-ink text-[36px] md:text-[52px] leading-[1] tracking-tight normal-case break-words">
          {q.entry.word}
        </h2>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {q.phraseChars?.map((c, i) =>
            c === null ? (
              <span
                key={i}
                className="font-zh font-extrabold text-coral text-[40px] md:text-[56px] leading-none w-[1.2em] h-[1.4em] border-b-[4px] border-coral inline-flex items-center justify-center"
                aria-label="missing character"
              >
                ？
              </span>
            ) : (
              <span
                key={i}
                className="font-zh font-bold text-green-deep text-[40px] md:text-[56px] leading-none"
              >
                {c}
              </span>
            ),
          )}
        </div>
        {q.entry.pinyin && (
          <p className="mt-3 font-sans italic text-sage text-base md:text-lg">
            {q.entry.pinyin}
          </p>
        )}
        <p className="mt-4 label-mono text-sage">Pick the missing character.</p>
      </div>
    );
  }

  // match
  return (
    <div>
      <h2 className="font-zh font-bold text-green-deep text-[44px] md:text-[64px] leading-[1] break-words">
        {q.entry.chineseTranslation}
      </h2>
      {q.entry.pinyin && (
        <p className="mt-3 font-sans italic text-sage text-lg md:text-xl">
          {q.entry.pinyin}
        </p>
      )}
      <p className="mt-4 label-mono text-sage">
        {q.matchTarget === "word"
          ? "Which English term matches?"
          : "Which definition matches?"}
      </p>
    </div>
  );
}

/* ── Choice text, by style ─────────────────────────────────────────────── */
function ChoiceText({ style, text }: { style: QuizQuestion["choiceStyle"]; text: string }) {
  if (style === "zh-char") {
    return (
      <span className="font-zh font-bold text-[34px] md:text-[40px] leading-none">
        {text}
      </span>
    );
  }
  if (style === "zh-term") {
    return (
      <span className="font-zh font-bold text-[24px] md:text-[30px] leading-[1.3] break-words [overflow-wrap:anywhere]">
        {text}
      </span>
    );
  }
  if (style === "en-word") {
    return (
      <span className="font-display font-extrabold normal-case text-[20px] md:text-[24px] leading-[1.3] break-words [overflow-wrap:anywhere]">
        {text}
      </span>
    );
  }
  // en-desc
  return (
    <span className="block flex-1 min-w-0 whitespace-normal break-words text-[15px] md:text-[17px] leading-[1.7] [overflow-wrap:anywhere] [text-overflow:clip] overflow-visible">
      {text}
    </span>
  );
}
