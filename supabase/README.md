# NSCD Backend — How It Works

This document explains how the NSCD app stores and manages data.
No coding knowledge required to understand this!

---

## The Big Picture

The NSCD app has two types of information to manage:

1. **The vocabulary content** — the actual climate words, their Chinese translations, definitions, and example sentences.
2. **User progress** — which words each person has completed.

These two types of information are stored in **different places**, for a good reason. Here's why.

---

## Where the Vocabulary Content Lives — Local File

All 149 climate vocabulary words are stored in a single file on the app's own server:

```
data/vocabulary.json
```

Think of this like a **laminated reference card** — it never changes unless we deliberately update it. Every word has a unique ID (called a "slug") that looks like this:

| English Word | Unique ID (slug) |
|---|---|
| Carbon Neutrality | `carbon-neutrality` |
| Net Zero | `net-zero` |
| Dual Carbon Goals | `dual-carbon-goals` |
| "1+N" Policy Framework | `1-plus-n-policy-framework` |

This ID is the key that connects the vocabulary content to the user's progress.

**Why store it locally instead of in a database?**
- The vocabulary list doesn't change often — it doesn't need to be in a live database.
- It's faster to read from a local file than to make a database request every time.
- It keeps the database simple and cheap to run.

---

## Where User Progress Lives — Supabase

[Supabase](https://supabase.com) is the app's online database. It handles two things:

### 1. User Accounts (Authentication)
When someone signs up for NSCD, Supabase creates their account and handles their login securely. We never store passwords ourselves — Supabase takes care of all of that.

When a new user signs up, the database **automatically** creates a profile for them. No manual work needed.

### 2. Vocabulary Progress
Every time a user completes a vocabulary word, the app saves a small record to Supabase that looks like this:

| Field | Example | What it means |
|---|---|---|
| `user_id` | `a1b2c3...` | Which user completed it |
| `vocab_id` | `carbon-neutrality` | Which word they completed |
| `completed` | `true` | Whether it's done |
| `completed_at` | `2026-05-18 10:32:00` | When they completed it |

That's it. Supabase does **not** store the word definitions, translations, or quiz answers — just the completion record.

---

## How They Connect

Here's the flow when a user completes a word:

```
User completes "Carbon Neutrality"
        ↓
App looks up the word's ID from vocabulary.json
        → ID is "carbon-neutrality"
        ↓
App saves to Supabase:
        → user_id: "this user"
        → vocab_id: "carbon-neutrality"
        → completed: true
```

And when the app loads a user's progress page:

```
App fetches all completed vocab_ids from Supabase
        → ["carbon-neutrality", "net-zero", "methane", ...]
        ↓
App reads the full word details from vocabulary.json
        → looks up each ID to get the word, translation, definition
        ↓
Shows the user their completed words with full content
```

The `vocab_id` slug is the **bridge** between the two systems.

---

## Privacy & Security

- Each user can **only see their own progress** — it's impossible for one user to read another user's data. This is enforced at the database level (called "Row Level Security").
- Users are automatically **siloed** from each other. Even if someone tried to access another user's data, the database would refuse.

---

## The Three Helper Functions

The app uses three simple functions to talk to Supabase:

### `markVocabCompleted("carbon-neutrality")`
> "This user just finished the word 'Carbon Neutrality'. Save it."

Saves a completion record. Safe to call multiple times — it won't create duplicates.

### `getUserProgress()`
> "Give me a list of everything this user has completed."

Returns all completed words for the logged-in user, most recent first. The frontend uses this to show progress stats and highlight finished words.

### `isVocabCompleted("carbon-neutrality")`
> "Has this user already completed 'Carbon Neutrality'? Yes or no."

Returns `true` or `false`. Useful for showing a checkmark on a word card, or skipping already-completed words in the quiz.

---

## File Map

```
Web/
├── data/
│   └── vocabulary.json          ← All 149 climate words (local, not in database)
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  ← Instructions for setting up the database tables
│   └── README.md                ← This file
│
└── lib/
    └── supabase/
        ├── client.ts            ← Opens the connection to Supabase
        ├── types.ts             ← Describes the shape of data in the database
        └── vocabulary-progress.ts  ← The three helper functions above
```

---

## What's NOT in the Database (Yet)

To keep the MVP simple, the following are **deliberately left out** for now:

- ❌ Quiz scores or attempts
- ❌ Full vocabulary word content (definitions, translations)
- ❌ Matching game data
- ❌ Word categories or difficulty levels

These can be added later as the product grows.

---

## Next Steps (When You're Ready)

1. **Run the migration** — paste `001_initial_schema.sql` into the Supabase SQL editor to create the tables.
2. **Add environment variables** — add your Supabase URL and key to the app's `.env.local` file.
3. **Connect the frontend** — import the helper functions into your React components when the UI is ready.
