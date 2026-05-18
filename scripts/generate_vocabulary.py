"""
generate_vocabulary.py
======================
Converts "Vocabulary List.xlsx" into "data/vocabulary.json".

Run this any time you add or update words in the Excel file:
    python3 scripts/generate_vocabulary.py

Rules:
  - Each word gets a stable slug ID (e.g. "carbon-neutrality")
  - NEVER rename or delete an existing slug — doing so will break
    saved user progress in Supabase. Only ADD new rows.
  - The script will warn you if it detects any duplicate slugs.
"""

import json
import re
import sys
from pathlib import Path

# ── Paths (relative to the project root) ────────────────────────────────────
PROJECT_ROOT = Path(__file__).parent.parent
EXCEL_FILE   = PROJECT_ROOT / "Vocabulary List.xlsx"
OUTPUT_FILE  = PROJECT_ROOT / "data" / "vocabulary.json"

# ── Slug generator ───────────────────────────────────────────────────────────
def slugify(text: str) -> str:
    """Convert an English term to a stable URL-safe ID. e.g. 'Net Zero' -> 'net-zero'"""
    text = text.lower().strip()
    text = re.sub(r'\+', '-plus-', text)   # "1+N" -> "1-plus-n"
    text = re.sub(r'[^\w\s-]', '', text)   # remove punctuation
    text = re.sub(r'\s+', '-', text)       # spaces to hyphens
    text = re.sub(r'-+', '-', text)        # collapse multiple hyphens
    return text.strip('-')

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    try:
        import pandas as pd
    except ImportError:
        print("Error: pandas is not installed. Run:  pip3 install pandas openpyxl")
        sys.exit(1)

    if not EXCEL_FILE.exists():
        print(f"Error: Could not find '{EXCEL_FILE}'")
        print("Make sure you run this script from the project root.")
        sys.exit(1)

    print(f"Reading: {EXCEL_FILE.name}")
    df = pd.read_excel(EXCEL_FILE)

    required_columns = [
        'Word', 'Chinese Translation', 'Description',
        'Answer A', 'Answer B', 'Answer C', 'Example'
    ]
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        print(f"Error: Missing columns in Excel file: {missing}")
        sys.exit(1)

    vocab = []
    slugs_seen = {}

    for i, row in df.iterrows():
        word = str(row['Word']).strip()

        # Skip empty rows
        if not word or word == 'nan':
            continue

        slug = slugify(word)

        # Warn on duplicate slugs
        if slug in slugs_seen:
            print(
                f"Warning: Duplicate slug '{slug}' "
                f"(row {i + 2}: '{word}' conflicts with row {slugs_seen[slug]}). "
                f"Please rename one of them."
            )
        else:
            slugs_seen[slug] = i + 2  # +2 for 1-based row + header row

        vocab.append({
            "id":                 slug,
            "word":               word,
            "chineseTranslation": str(row['Chinese Translation']).strip(),
            "description":        str(row['Description']).strip(),
            "answerA":            str(row['Answer A']).strip(),
            "answerB":            str(row['Answer B']).strip(),
            "answerC":            str(row['Answer C']).strip(),
            "example":            str(row['Example']).strip(),
        })

    # Write output
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)

    print(f"Done! {len(vocab)} words written to: {OUTPUT_FILE.relative_to(PROJECT_ROOT)}")

    if len(slugs_seen) < len(vocab):
        print("Action needed: fix duplicate slugs before committing.")
        sys.exit(1)
    else:
        print("No duplicate IDs found. ✓")
        print("\nNext steps:")
        print("  git add data/vocabulary.json 'Vocabulary List.xlsx'")
        print("  git commit -m 'Update vocabulary list'")
        print("  git push origin main")

if __name__ == "__main__":
    main()
