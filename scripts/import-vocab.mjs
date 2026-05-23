// Regenerate data/vocabulary.json from the canonical Excel source.
// Usage:   node scripts/import-vocab.mjs
// Reads:   D:\NSCDGit\Web\Vocabulary List.xlsx
// Writes:  data/vocabulary.json (overwrites in place)
//
// The script preserves existing slug IDs by matching on the English word; new
// terms get a fresh kebab-case slug.

import * as XLSX from "xlsx";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = "D:/NSCDGit/Web/Vocabulary_List_with_Revised_Simple_Pronunciation_Guide.xlsx";
const OUT = path.resolve(__dirname, "..", "data", "vocabulary.json");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^1-/, "1-"); // safe for "1+N policy" etc.
}

const existing = JSON.parse(readFileSync(OUT, "utf8"));
const existingByWord = new Map(existing.map((e) => [e.word.toLowerCase(), e.id]));

const wb = XLSX.read(readFileSync(SRC), { type: "buffer" });
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

console.log(`Read ${rows.length} rows from ${SRC}`);
console.log("Headers:", Object.keys(rows[0]));

const norm = (s) => String(s ?? "").trim();

const out = rows.map((r) => {
  const word = norm(r["Word"]);
  const id = existingByWord.get(word.toLowerCase()) ?? slugify(word);
  // Pinyin column may be named "Chinese Pinyin" or "Pinyin" — accept both.
  const pinyin = norm(r["Chinese Pinyin"] ?? r["Pinyin"] ?? "");
  // English pronunciation guide column — added 2026-05-21.
  const pronunciation = norm(
    r["English Pronunciation Guide"] ??
      r["Pronunciation Guide"] ??
      r["Pronunciation"] ??
      "",
  );
  return {
    id,
    category: norm(r["Category"]),
    word,
    chineseTranslation: norm(r["Chinese Translation"]),
    pinyin,
    pronunciation,
    description: norm(r["Description"]),
    answerA: norm(r["Answer A"]),
    answerB: norm(r["Answer B"]),
    answerC: norm(r["Answer C"]),
    example: norm(r["Example"]),
  };
});

// Quick sanity check
const cats = [...new Set(out.map((e) => e.category))].filter(Boolean).sort();
console.log(`Distinct categories (${cats.length}):`, cats);

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`Wrote ${out.length} entries to ${OUT}`);
