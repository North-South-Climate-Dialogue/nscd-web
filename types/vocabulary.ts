export interface VocabEntry {
  id: string;
  category: string;
  word: string;
  chineseTranslation: string;
  pinyin: string;
  pronunciation: string;
  description: string;
  answerA: string;
  answerB: string;
  answerC: string;
  example: string;
  exampleEnglish: string;
}

/**
 * The 9 categories that appear in the workbook. Maintained here so the
 * filter UI can render swatches in a stable order even before the data loads.
 */
export const CATEGORIES = [
  "Basic Concept",
  "Greenhouse gases",
  "Energy",
  "Natural Environment",
  "Agriculture",
  "Technology",
  "Social Impact",
  "Policies & Cooperation",
  "Green Lifestyle",
] as const;

export type Category = (typeof CATEGORIES)[number];
