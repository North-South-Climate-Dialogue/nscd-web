/**
 * Pinyin reference data sourced from:
 *   - D:\NSCDGit\Web\What is Pinyin Like.docx
 *   - D:\NSCDGit\NSCD Brochure.pdf (page 3 — "Quick Guide to Pinyin")
 *
 * Kept here as plain TS so the page renders entirely server-side with no
 * client JS just to ship a reference table.
 */

export interface SoundEntry {
  letter: string;
  similar: string;          // English comparison
  example?: string;         // optional Chinese/climate example
  note?: string;            // optional tongue-position or special-case note
}

export const INITIALS: SoundEntry[] = [
  { letter: "b",  similar: "‘b’ in boat" },
  { letter: "p",  similar: "‘p’ in pen" },
  { letter: "m",  similar: "‘m’ in map" },
  { letter: "f",  similar: "‘f’ in fire" },
  { letter: "d",  similar: "‘d’ in dog" },
  { letter: "t",  similar: "‘t’ in teacher" },
  { letter: "n",  similar: "‘n’ in name" },
  { letter: "l",  similar: "‘l’ in look" },
  { letter: "g",  similar: "‘g’ in go" },
  { letter: "k",  similar: "‘k’ in kiss" },
  { letter: "h",  similar: "‘h’ in high" },
  { letter: "j",  similar: "‘j’ in jeep",     note: "tongue is positioned below lower teeth" },
  { letter: "q",  similar: "‘ch’ in cheap",   note: "tongue is positioned below lower teeth" },
  { letter: "x",  similar: "‘sh’ in sheep",   note: "tongue is positioned below lower teeth" },
  { letter: "z",  similar: "‘ds’ in birds" },
  { letter: "c",  similar: "‘ts’ in cats" },
  { letter: "s",  similar: "‘s’ in sing" },
  { letter: "zh", similar: "‘j’ in jam" },
  { letter: "ch", similar: "‘ch’ in change" },
  { letter: "sh", similar: "‘sh’ in she" },
  { letter: "r",  similar: "‘r’ in run" },
  { letter: "y",  similar: "‘y’ in yard" },
  { letter: "w",  similar: "‘w’ in wood" },
];

export const FINALS: SoundEntry[] = [
  { letter: "a",   similar: "‘ah’ in Ah-hah!" },
  { letter: "o",   similar: "‘o’ in go" },
  { letter: "e",   similar: "‘er’ in her, without the tongue curling up" },
  { letter: "i",   similar: "‘ee’ in see" },
  { letter: "u",   similar: "‘oo’ in food" },
  { letter: "ü",   similar: "the ‘u’ sound, but with the lips pouting up",  note: "No English equivalent" },
  { letter: "ai",  similar: "the English ‘eye’" },
  { letter: "ei",  similar: "‘ey’ in hey" },
  { letter: "ui",  similar: "combine ‘u’ and ‘i’" },
  { letter: "ao",  similar: "‘ou’ in loud" },
  { letter: "ou",  similar: "‘oa’ in boat" },
  { letter: "iu",  similar: "combine ‘i’ and ‘u’" },
  { letter: "ie",  similar: "combine ‘i’ and ‘e’" },
  { letter: "er",  similar: "‘ear’ in early" },
  { letter: "an",  similar: "‘an’ in fan" },
  { letter: "en",  similar: "‘en’ in end" },
  { letter: "in",  similar: "‘in’ in pin" },
  { letter: "un",  similar: "combine ‘u’ and ‘n’" },
  { letter: "ang", similar: "‘ang’ in slang" },
  { letter: "eng", similar: "‘ung’ in hung" },
  { letter: "ing", similar: "‘ing’ in king" },
  { letter: "ong", similar: "‘ong’ in song" },
];

export interface TrickyHighlight {
  pinyin: string;
  hint: string;
  example: { word: string; chinese: string; pinyin: string; en: string };
}

export const TRICKY: TrickyHighlight[] = [
  {
    pinyin: "q",
    hint: "Sounds like ‘ch’ in cheese — not ‘k’ as in queen.",
    example: { word: "Climate",  chinese: "气候",     pinyin: "qì hòu",       en: "qì hòu = climate" },
  },
  {
    pinyin: "x",
    hint: "A soft ‘sh’ — gentler than the English ‘sh’.",
    example: { word: "Circular", chinese: "循环",     pinyin: "xún huán",     en: "xún huán = circular" },
  },
  {
    pinyin: "zh",
    hint: "Like the ‘j’ in judge.",
    example: { word: "Neutral",  chinese: "中和",     pinyin: "zhōng hé",     en: "zhōng hé = neutral" },
  },
  {
    pinyin: "c",
    hint: "Like ‘ts’ in cats — never a hard ‘k’ sound.",
    example: { word: "Policy",   chinese: "政策",     pinyin: "zhèng cè",     en: "zhèng cè = policy" },
  },
  {
    pinyin: "ü",
    hint: "Similar to the French ‘u’ in lune. Lips pout slightly.",
    example: { word: "Green",    chinese: "绿",       pinyin: "lǜ",           en: "lǜ = green" },
  },
];

export const TONES = [
  {
    n: "1",
    name: "First tone",
    mark: "ā",
    desc: "High and flat. Holds a steady pitch, slightly longer than the others.",
    feel: "Like singing one steady note.",
  },
  {
    n: "2",
    name: "Second tone",
    mark: "á",
    desc: "Rising. Goes from mid to high — sounds like asking a question.",
    feel: "Like the lift in saying ‘What?’",
  },
  {
    n: "3",
    name: "Third tone",
    mark: "ǎ",
    desc: "Falling–rising. Dip low first, then rise. Keep the bottom very low.",
    feel: "Like saying ‘Ohh-kay?’ with hesitation.",
  },
  {
    n: "4",
    name: "Fourth tone",
    mark: "à",
    desc: "Sharp and falling. Short, decisive — the ‘angry’ tone.",
    feel: "Like a firm ‘No!’",
  },
] as const;

/** Same pinyin letters, different tones, completely different meanings. */
export const TONE_DEMO = [
  { pinyin: "mā", char: "妈", meaning: "mother" },
  { pinyin: "má", char: "麻", meaning: "numb" },
  { pinyin: "mǎ", char: "马", meaning: "horse" },
  { pinyin: "mà", char: "骂", meaning: "curse" },
] as const;
