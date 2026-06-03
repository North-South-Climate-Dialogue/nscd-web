import type { VocabEntry } from "@/types/vocabulary";

/**
 * "Test your understanding" — mixed quiz engine.
 *
 * A round is a fixed set of questions (default 20) drawn from the climate
 * glossary. Each question is one of three kinds, randomly assigned per term:
 *
 *   1. "fill-blank"  — a Chinese example sentence with the term blanked out;
 *                       pick the Chinese term that fills the gap.
 *   2. "match"       — a Chinese term + pinyin; pick the matching English
 *                       word, or the matching English definition.
 *   3. "char-pick"   — the English word plus the Chinese phrase with one
 *                       character blanked (e.g. 碳中和 → "_中和"); pick the
 *                       missing Chinese character.
 *
 * Every question renders as a 3-option multiple-choice card so the play +
 * keyboard flow (1 / 2 / 3 / Enter) stays uniform.
 */

export type QuizQuestionType = "fill-blank" | "match" | "char-pick";

/** How a choice button should be rendered. */
export type ChoiceStyle = "zh-term" | "zh-char" | "en-word" | "en-desc";

export interface QuizChoice {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  type: QuizQuestionType;
  entry: VocabEntry;
  choices: QuizChoice[]; // exactly 3, shuffled
  choiceStyle: ChoiceStyle;

  // fill-blank: the example sentence split around the blanked term
  sentenceBefore?: string;
  sentenceAfter?: string;

  // char-pick: characters of the Chinese phrase, blanked slot is null
  phraseChars?: (string | null)[];

  // match: what the user is matching the Chinese term against
  matchTarget?: "word" | "description";
}

export const DEFAULT_ROUND = 20;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** Chinese characters of a string (handles surrogate pairs safely). */
function chars(s: string): string[] {
  return Array.from(s);
}

/** True if the example sentence actually contains the Chinese term. */
function exampleHasTerm(e: VocabEntry): boolean {
  return Boolean(e.example) && Boolean(e.chineseTranslation) &&
    e.example.includes(e.chineseTranslation);
}

/** Which question types are buildable for a given entry. */
function validTypes(e: VocabEntry, all: VocabEntry[]): QuizQuestionType[] {
  const types: QuizQuestionType[] = [];

  // match — needs at least 2 other distractor terms (always true in practice)
  if (e.word && e.chineseTranslation && all.length >= 3) types.push("match");

  // fill-blank — example must contain the term + need distractor terms
  if (exampleHasTerm(e) && all.length >= 3) types.push("fill-blank");

  // char-pick — phrase must be ≥ 2 chars + enough distinct distractor chars
  if (chars(e.chineseTranslation).length >= 2) types.push("char-pick");

  return types;
}

function buildFillBlank(e: VocabEntry, all: VocabEntry[]): QuizQuestion {
  const idx = e.example.indexOf(e.chineseTranslation);
  const sentenceBefore = e.example.slice(0, idx);
  const sentenceAfter = e.example.slice(idx + e.chineseTranslation.length);

  const distractors = pick(
    all
      .filter((o) => o.id !== e.id && o.chineseTranslation &&
        o.chineseTranslation !== e.chineseTranslation)
      .map((o) => o.chineseTranslation),
    2,
  );

  const choices: QuizChoice[] = shuffle([
    { text: e.chineseTranslation, correct: true },
    ...distractors.map((t) => ({ text: t, correct: false })),
  ]);

  return {
    type: "fill-blank",
    entry: e,
    choices,
    choiceStyle: "zh-term",
    sentenceBefore,
    sentenceAfter,
  };
}

function buildMatch(e: VocabEntry, all: VocabEntry[]): QuizQuestion {
  const target: "word" | "description" =
    Math.random() < 0.5 ? "word" : "description";
  const field = target === "word" ? "word" : "description";

  const correct = e[field];
  const distractors = pick(
    all
      .filter((o) => o.id !== e.id && o[field] && o[field] !== correct)
      .map((o) => o[field]),
    2,
  );

  const choices: QuizChoice[] = shuffle([
    { text: correct, correct: true },
    ...distractors.map((t) => ({ text: t, correct: false })),
  ]);

  return {
    type: "match",
    entry: e,
    choices,
    choiceStyle: target === "word" ? "en-word" : "en-desc",
    matchTarget: target,
  };
}

function buildCharPick(e: VocabEntry, all: VocabEntry[]): QuizQuestion {
  const phrase = chars(e.chineseTranslation);
  const blankAt = Math.floor(Math.random() * phrase.length);
  const correctChar = phrase[blankAt];

  // Pool of single distractor characters drawn from other terms.
  const pool = new Set<string>();
  for (const o of all) {
    if (o.id === e.id) continue;
    for (const c of chars(o.chineseTranslation)) {
      if (c !== correctChar && /\p{Script=Han}/u.test(c)) pool.add(c);
    }
  }
  const distractors = pick([...pool], 2);

  const phraseChars: (string | null)[] = phrase.map((c, i) =>
    i === blankAt ? null : c,
  );

  const choices: QuizChoice[] = shuffle([
    { text: correctChar, correct: true },
    ...distractors.map((t) => ({ text: t, correct: false })),
  ]);

  return {
    type: "char-pick",
    entry: e,
    choices,
    choiceStyle: "zh-char",
    phraseChars,
  };
}

function buildOne(
  type: QuizQuestionType,
  e: VocabEntry,
  all: VocabEntry[],
): QuizQuestion {
  switch (type) {
    case "fill-blank":
      return buildFillBlank(e, all);
    case "char-pick":
      return buildCharPick(e, all);
    case "match":
    default:
      return buildMatch(e, all);
  }
}

/**
 * Build a round.
 *
 * @param pool   the entries the questions are drawn from (e.g. a category)
 * @param all    the full vocabulary, used to source distractors
 * @param count  number of questions (capped at pool size)
 */
export function buildQuiz(
  pool: VocabEntry[],
  all: VocabEntry[],
  count: number,
): QuizQuestion[] {
  const subjects = shuffle(pool).slice(0, count);
  return subjects.map((entry) => {
    const options = validTypes(entry, all);
    const type = options[Math.floor(Math.random() * options.length)] ?? "match";
    return buildOne(type, entry, all);
  });
}
