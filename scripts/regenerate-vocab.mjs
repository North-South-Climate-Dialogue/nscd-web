// Rebuild data/vocabulary.json from the latest workbook.
// Backs up the existing JSON to data/vocabulary.json.bak first so the previous
// data is recoverable.
//
// Source: D:/NSCDGit/Web/Vocabulary_List_with_Example_English_Translation_complete.xlsx
// Run with: node scripts/regenerate-vocab.mjs

import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const XLSX_PATH =
  process.argv[2] ??
  "D:/NSCDGit/Web/Vocabulary_List_with_Example_English_Translation_complete.xlsx";
const OUT_PATH = path.resolve("data/vocabulary.json");
const BACKUP_PATH = path.resolve("data/vocabulary.json.bak");

function slug(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[“”"']/g, "")
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const wb = xlsx.readFile(XLSX_PATH);
const ws = wb.Sheets[wb.SheetNames[0]];
const raw = xlsx.utils.sheet_to_json(ws, { defval: "" });

if (raw.length === 0) {
  console.error("Workbook is empty.");
  process.exit(1);
}

// Column-name resolution — handle minor header variation just in case.
function pick(row, ...candidates) {
  for (const k of candidates) {
    if (Object.prototype.hasOwnProperty.call(row, k)) return String(row[k] ?? "").trim();
  }
  return "";
}

const entries = [];
const seen = new Set();
const warnings = [];

for (let i = 0; i < raw.length; i++) {
  const r = raw[i];
  const word = pick(r, "Word");
  if (!word) {
    warnings.push(`Row ${i + 2}: missing Word — skipped.`);
    continue;
  }

  let id = slug(word);
  // Disambiguate any accidental collisions by appending -2, -3, etc.
  if (seen.has(id)) {
    let n = 2;
    while (seen.has(`${id}-${n}`)) n++;
    warnings.push(`Row ${i + 2}: duplicate id "${id}" — renamed to "${id}-${n}".`);
    id = `${id}-${n}`;
  }
  seen.add(id);

  const entry = {
    id,
    category:            pick(r, "Category"),
    word,
    chineseTranslation:  pick(r, "Chinese Translation"),
    pinyin:              pick(r, "Chinese Pinyin", "Pinyin"),
    pronunciation:       pick(r, "English Pronunciation Guide", "Pronunciation"),
    description:         pick(r, "Description"),
    answerA:             pick(r, "Answer A", "AnswerA"),
    answerB:             pick(r, "Answer B", "AnswerB"),
    answerC:             pick(r, "Answer C", "AnswerC"),
    example:             pick(r, "Example", "Example Chinese"),
    exampleEnglish:      pick(r, "Example English Translation", "Example English"),
  };

  // Sanity checks
  if (entry.description.endsWith("...") || entry.description.endsWith("…")) {
    warnings.push(`Row ${i + 2} (${id}): description still ends with ellipsis — possible truncation in source.`);
  }
  for (const k of ["answerA", "answerB", "answerC"]) {
    if (entry[k].endsWith("...") || entry[k].endsWith("…")) {
      warnings.push(`Row ${i + 2} (${id}): ${k} still ends with ellipsis.`);
    }
  }
  const matches = [entry.answerA, entry.answerB, entry.answerC].filter(
    (a) => a === entry.description,
  ).length;
  if (matches !== 1) {
    warnings.push(
      `Row ${i + 2} (${id}): ${matches} answer(s) match the description verbatim (expected exactly 1).`,
    );
  }

  entries.push(entry);
}

// Backup current file (only if it exists)
if (fs.existsSync(OUT_PATH)) {
  fs.copyFileSync(OUT_PATH, BACKUP_PATH);
  console.log(`Backed up existing JSON → ${path.relative(process.cwd(), BACKUP_PATH)}`);
}

fs.writeFileSync(OUT_PATH, JSON.stringify(entries, null, 2) + "\n", "utf8");

console.log(`Wrote ${entries.length} entries → ${path.relative(process.cwd(), OUT_PATH)}`);
if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log("  •", w);
} else {
  console.log("\nNo warnings — clean rebuild.");
}
