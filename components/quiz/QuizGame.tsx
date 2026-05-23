"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { VocabEntry } from "@/types/vocabulary";
import { catSlug } from "@/lib/glossary/filters";
import { buildQuiz, type QuizQuestion } from "@/lib/quiz/build";
import { useProgress } from "@/hooks/useProgress";
import QuizSetup, { type RoundLength } from "./QuizSetup";
import QuizPlay from "./QuizPlay";
import QuizResults, { type QuizAnswer } from "./QuizResults";

type Phase = "setup" | "playing" | "done";

export default function QuizGame({ entries }: { entries: VocabEntry[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { mark } = useProgress();

  const cat = searchParams.get("cat") ?? "";

  const [length, setLength] = useState<RoundLength>(10);
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const startedAtRef = useRef<number>(0);

  const pool = useMemo(
    () => (cat ? entries.filter((e) => catSlug(e.category) === cat) : entries),
    [entries, cat],
  );

  const writeCat = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("cat", next);
      else params.delete("cat");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const startRound = useCallback(
    (qs: QuizQuestion[]) => {
      setQuestions(qs);
      setCurrentIndex(0);
      setAnswers([]);
      setChosenIndex(null);
      setElapsedSec(0);
      startedAtRef.current = Date.now();
      setPhase("playing");
    },
    [],
  );

  const handleStart = useCallback(() => {
    const count = length === 0 ? pool.length : Math.min(length, pool.length);
    if (count === 0) return;
    startRound(buildQuiz(pool, count));
  }, [length, pool, startRound]);

  const handleRetry = useCallback(() => {
    startRound(questions); // same questions, reshuffled choices? keep same for fairness
  }, [questions, startRound]);

  const handleNewRound = useCallback(() => {
    setPhase("setup");
  }, []);

  const handleChoose = useCallback(
    (idx: number) => {
      if (chosenIndex !== null) return;
      const q = questions[currentIndex];
      if (!q) return;
      const isCorrect = q.choices[idx].correct;
      setChosenIndex(idx);
      setAnswers((prev) => [
        ...prev,
        { questionIndex: currentIndex, chosenIndex: idx, correct: isCorrect },
      ]);
      if (isCorrect) {
        void mark(q.entry.id);
      }
    },
    [chosenIndex, currentIndex, mark, questions],
  );

  const handleNext = useCallback(() => {
    setChosenIndex(null);
    if (currentIndex + 1 >= questions.length) {
      setPhase("done");
      return;
    }
    setCurrentIndex((i) => i + 1);
  }, [currentIndex, questions.length]);

  // Timer — counts up only while playing
  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [phase]);

  // Keyboard: 1/2/3 to choose, Enter to advance
  useEffect(() => {
    if (phase !== "playing") return;
    function handler(e: KeyboardEvent) {
      const ae = document.activeElement as HTMLElement | null;
      if (ae) {
        const tag = ae.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      }
      if (chosenIndex === null) {
        if (e.key === "1") {
          e.preventDefault();
          handleChoose(0);
        } else if (e.key === "2") {
          e.preventDefault();
          handleChoose(1);
        } else if (e.key === "3") {
          e.preventDefault();
          handleChoose(2);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, chosenIndex, handleChoose, handleNext]);

  if (phase === "setup") {
    return (
      <QuizSetup
        cat={cat}
        length={length}
        available={pool.length}
        onChangeCat={writeCat}
        onChangeLength={setLength}
        onStart={handleStart}
      />
    );
  }

  if (phase === "playing") {
    const current = questions[currentIndex];
    if (!current) return null;
    return (
      <QuizPlay
        question={current}
        position={currentIndex + 1}
        total={questions.length}
        elapsedSec={elapsedSec}
        chosenIndex={chosenIndex}
        onChoose={handleChoose}
        onNext={handleNext}
        isLast={currentIndex === questions.length - 1}
      />
    );
  }

  // done
  return (
    <QuizResults
      questions={questions}
      answers={answers}
      elapsedSec={elapsedSec}
      onRetry={handleRetry}
      onNewRound={handleNewRound}
    />
  );
}
