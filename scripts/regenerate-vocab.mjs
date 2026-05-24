// Rebuild data/vocabulary.json from "Vocabulary List.xlsx".
//
// MIRROR OF scripts/generate_vocabulary.py — produces byte-identical output.
// Maintained alongside the Python script so contributors without Python can
// regenerate the JSON. If the slug rules ever change, update BOTH files.
//
// Run with: node scripts/regenerate-vocab.mjs
//
// Backs up the existing JSON to data/vocabulary.json.bak first so the previous
// data is recoverable.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xlsx from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(__filename), "..");
const EXCEL_FILE   = path.join(PROJECT_ROOT, "Vocabulary List.xlsx");
const OUTPUT_FILE  = path.join(PROJECT_ROOT, "data", "vocabulary.json");
const BACKUP_FILE  = path.join(PROJECT_ROOT, "data", "vocabulary.json.bak");

/**
 * Slug rules — exact port of generate_vocabulary.py:slugify().
 *   1. lowercase + trim
 *   2. "+" → "-plus-"
 *   3. drop everything except [A-Za-z0-9_], spaces, and hyphens
 *   4. spaces → hyphens
 *   5. collapse repeated hyphens
 *   6. strip leading/trailing hyphens
 *
 * Python uses `\w` which in re without re.ASCII matches Unicode word
 * characters, but vocab words are pure ASCII so this matches both.
 */
function slugify(text) {
  let t = String(text).toLowerCase().trim();
  t = t.replace(/\+/g, "-plus-");
  t = t.replace(/[^A-Za-z0-9_\s-]/g, "");
  t = t.replace(/\s+/g, "-");
  t = t.replace(/-+/g, "-");
  return t.replace(/^-+|-+$/g, "");
}

/** Trim a cell value, treat "nan" / missing as empty string. */
function cell(row, column) {
  const v = row[column];
  if (v === undefined || v === null) return "";
  const s = String(v).trim();
  return s === "nan" ? "" : s;
}

function main() {
  if (!fs.existsSync(EXCEL_FILE)) {
    console.error(`Error: Could not find '${EXCEL_FILE}'`);
    process.exit(1);
  }

  console.log(`Reading: ${path.basename(EXCEL_FILE)}`);
  const wb = xlsx.readFile(EXCEL_FILE);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: "" });

  const required = ["Word", "Chinese Translation", "Description",
                    "Answer A", "Answer B", "Answer C", "Example"];
  if (rows.length > 0) {
    const have = new Set(Object.keys(rows[0]));
    const missing = required.filter((c) => !have.has(c));
    if (missing.length) {
      console.error(`Error: Missing columns: ${missing.join(", ")}`);
      process.exit(1);
    }
  }

  const vocab = [];
  const slugsSeen = new Map();
  const warnings = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const word = cell(r, "Word");
    if (!word) continue;

    const slug = slugify(word);
    if (slugsSeen.has(slug)) {
      warnings.push(
        `Duplicate slug '${slug}' (row ${i + 2}: '${word}' conflicts with row ${slugsSeen.get(slug)})`,
      );
    } else {
      slugsSeen.set(slug, i + 2);
    }

    const entry = {
      id:                 slug,
      category:           cell(r, "Category"),
      word,
      chineseTranslation: cell(r, "Chinese Translation"),
      pinyin:             cell(r, "Chinese Pinyin"),
      pronunciation:      cell(r, "English Pronunciation Guide"),
      description:        cell(r, "Description"),
      answerA:            cell(r, "Answer A"),
      answerB:            cell(r, "Answer B"),
      answerC:            cell(r, "Answer C"),
      example:            cell(r, "Example"),
      exampleEnglish:     cell(r, "Example English Translation"),
    };

    const matches = ["answerA", "answerB", "answerC"]
      .filter((k) => entry[k] === entry.description).length;
    if (matches !== 1) {
      warnings.push(
        `Row ${i + 2} ('${word}'): ${matches} of A/B/C match description (expected 1)`,
      );
    }

    vocab.push(entry);
  }

  if (fs.existsSync(OUTPUT_FILE)) {
    fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE);
    console.log(`Backed up existing JSON → ${path.relative(PROJECT_ROOT, BACKUP_FILE)}`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(vocab, null, 2) + "\n", "utf8");
  console.log(`Done! ${vocab.length} words written to: ${path.relative(PROJECT_ROOT, OUTPUT_FILE)}`);

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log("  •", w);
    if (slugsSeen.size < vocab.length) {
      console.log("\nAction needed: fix duplicate slugs before committing.");
      process.exit(1);
    }
  } else {
    console.log("No duplicate IDs found. ✓");
  }

  console.log("\nNext steps:");
  console.log("  git add data/vocabulary.json 'Vocabulary List.xlsx'");
  console.log("  git commit -m 'Update vocabulary list'");
  console.log("  git push origin main");
}

main();
