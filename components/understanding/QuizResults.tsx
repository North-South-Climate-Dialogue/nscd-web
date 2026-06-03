"use client";

import Link from "next/link";
import type { QuizQuestion } from "@/lib/quiz/understanding";

export interface QuizAnswer {
  questionIndex: number;
  chosenIndex: number;
  correct: boolean;
}

export default function QuizResults({
  questions,
  answers,
  elapsedSec,
  onRetry,
  onNewRound,
}: {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  elapsedSec: number;
  onRetry: () => void;
  onNewRound: () => void;
}) {
  const total = questions.length;
  const correct = answers.filter((a) => a.correct).length;
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  const missed = answers
    .filter((a) => !a.correct)
    .map((a) => ({
      question: questions[a.questionIndex],
      chosen: questions[a.questionIndex].choices[a.chosenIndex],
    }));

  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ss = String(elapsedSec % 60).padStart(2, "0");

  return (
    <section className="max-w-[920px] mx-auto px-6 md:px-8 py-12">
      {/* Score card */}
      <div className="border-2 border-ink bg-paper p-8 md:p-12 shadow-thunk-lg">
        <div className="label-mono text-coral mb-3">Round complete</div>
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-end">
          <div>
            <div className="font-display font-extrabold text-ink text-[80px] md:text-[120px] leading-[0.9] tracking-tight">
              {correct} / {total}
            </div>
            <p className="mt-3 text-ink/80 text-[17px] leading-[1.5] max-w-[44ch]">
              {correct === total
                ? "A clean sweep. Every term is now in your learned list."
                : correct === 0
                  ? "First round in the books. Try again — you'll know more by the next pass."
                  : `Not bad. ${correct} of ${total} terms are now in your learned list — review the rest below.`}
            </p>
          </div>
          <div className="border-l-0 md:border-l-2 md:border-ink md:pl-8 space-y-3">
            <Stat label="Score" value={`${pct}%`} />
            <Stat label="Time" value={`${mm}:${ss}`} mono />
            <Stat label="Missed" value={`${missed.length}`} mono />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="bg-coral border-2 border-ink px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
          >
            ↻ Retry same set
          </button>
          <button
            type="button"
            onClick={onNewRound}
            className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] hover:bg-ink hover:text-paper transition-colors"
          >
            New round
          </button>
          <Link
            href="/learning/glossary"
            className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] hover:bg-ink hover:text-paper transition-colors text-center"
          >
            Back to glossary →
          </Link>
        </div>
      </div>

      {/* Missed words */}
      {missed.length > 0 && (
        <div className="mt-10">
          <div className="label-mono text-coral mb-3">Review · words you missed</div>
          <h3 className="font-display font-extrabold text-ink text-[30px] md:text-[42px] leading-[0.95] tracking-tight normal-case max-w-[22ch]">
            Worth a second look.
          </h3>
          <div className="mt-6 border-2 border-ink bg-paper shadow-thunk-lg">
            {missed.map((m, i) => (
              <div
                key={m.question.entry.id}
                className={`block w-full px-6 py-6 md:px-8 md:py-7 ${
                  i < missed.length - 1 ? "border-b border-ink/15" : ""
                }`}
              >
                {/* Word header row — English / Chinese / pinyin wraps gracefully */}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 min-w-0">
                  <span
                    className="font-display font-extrabold text-ink text-[24px] md:text-[28px] leading-tight normal-case min-w-0"
                    style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                  >
                    {m.question.entry.word}
                  </span>
                  <span className="font-zh font-medium text-green-deep text-lg md:text-xl leading-tight">
                    {m.question.entry.chineseTranslation}
                  </span>
                  {m.question.entry.pinyin && (
                    <span className="font-sans italic text-sage text-sm md:text-base leading-tight">
                      {m.question.entry.pinyin}
                    </span>
                  )}
                </div>

                {/* "Your answer" — labelled, struck through, full wrap */}
                <div className="mt-4 w-full min-w-0">
                  <div className="label-mono text-sage mb-1">Your answer</div>
                  <p
                    className="block w-full min-w-0 text-ink/75 text-[15px] leading-[1.65] line-through"
                    style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                  >
                    {m.chosen.text}
                  </p>
                </div>

                {/* "Correct" — labelled, full wrap, coral accent */}
                <div className="mt-4 w-full min-w-0">
                  <div className="label-mono text-coral mb-1">Correct</div>
                  <p
                    className="block w-full min-w-0 text-ink text-[15px] md:text-[16px] leading-[1.65]"
                    style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                  >
                    {m.question.entry.description}
                  </p>
                </div>

                {/* Glossary link — own row so it never compresses the text column */}
                <Link
                  href={`/learning/glossary?sel=${m.question.entry.id}`}
                  className="mt-5 inline-block label-mono text-coral border-b-2 border-coral hover:text-ink hover:border-ink transition-colors"
                >
                  Open in glossary →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="label-mono text-sage">{label}</div>
      <div className={`${mono ? "font-mono" : "font-display font-extrabold"} text-ink text-[28px] md:text-[32px] leading-none mt-1`}>
        {value}
      </div>
    </div>
  );
}
