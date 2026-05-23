import type { VocabEntry } from "@/types/vocabulary";

export interface QuizChoice {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  entry: VocabEntry;
  choices: QuizChoice[]; // exactly 3, shuffled
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build a round of quiz questions from a pool of entries.
 *
 * Each entry has answerA / answerB / answerC where exactly one matches the
 * description. We use that to mark the correct choice, then shuffle the three
 * choices per question so the position rotates.
 */
export function buildQuiz(
  pool: VocabEntry[],
  count: number,
): QuizQuestion[] {
  const picks = shuffle(pool).slice(0, count);
  return picks.map((entry) => {
    const choices: QuizChoice[] = [
      { text: entry.answerA, correct: entry.answerA === entry.description },
      { text: entry.answerB, correct: entry.answerB === entry.description },
      { text: entry.answerC, correct: entry.answerC === entry.description },
    ];
    return { entry, choices: shuffle(choices) };
  });
}
