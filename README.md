# North South Climate Dialogue — Web Platform

**NSCD** is a bilingual climate vocabulary learning platform that helps English and Mandarin Chinese speakers learn climate terminology together — through flashcards, quizzes, and in-person collaborative workshops in Vancouver.

> *"Deconstruct. Translate. Rebuild."*

---

## What the website does

The NSCD website has several sections, each serving a different purpose:

| Section | What it does |
|---|---|
| **Home** | Introduction to NSCD, QiQi the mascot, and live platform stats |
| **Glossary** | Browse all 149 bilingual climate terms, filter by category, track progress |
| **Flashcards** | Flip-card study mode — EN → 中文 or 中文 → EN, with pinyin and pronunciation |
| **Quiz** | Multiple-choice rounds drawn from the vocabulary, with immediate feedback |
| **Pinyin Guide** | A simple guide to Mandarin pronunciation for English speakers |
| **Blog** | Field notes, workshop recaps, and essays on climate language |
| **About** | Who we are, our mission, QiQi's origin story, and co-founder bios |
| **Events** | Upcoming workshops and community events |
| **Contact** | Get in touch or express interest in joining |
| **Account** | Personal progress dashboard, language goals, and workshop matching form |

---

## The two building blocks

The website is made of two separate systems that work together:

### 🗂️ 1. The vocabulary list (local file)

All 149 climate terms live in a single file:

```
data/vocabulary.json
```

Each word contains everything the app needs to display and quiz it:

| Field | Example | What it is |
|---|---|---|
| `id` | `net-zero` | A unique stable identifier for the word |
| `word` | Net Zero | The English term |
| `chineseTranslation` | 净零排放 | The Mandarin translation |
| `pinyin` | jìng líng pái fàng | How to pronounce it |
| `pronunciation` | "jing" as in jingle... | Plain English pronunciation guide |
| `category` | Basic Concept | One of 9 topic categories |
| `description` | A state in which... | The correct definition |
| `answerA/B/C` | Three options... | Quiz answer choices (one is correct) |
| `example` | 英国的目标是... | Example sentence in Chinese |
| `exampleEnglish` | The UK aims to... | English translation of the example |

**To add new words:** update `Vocabulary List.xlsx` and run `python3 scripts/generate_vocabulary.py`. That's it — no database changes needed.

---

### 🗄️ 2. The database (Supabase)

[Supabase](https://supabase.com) is the app's secure online database. It stores only what needs to be personalised per user — not the vocabulary content itself.

Think of it this way:

> The vocabulary file is a **shared textbook** everyone reads from.
> The database is each student's **personal notebook** — private to them.

The database has three layers of functionality:

#### User accounts
When someone signs up, Supabase securely manages their email, password, and login session. A profile is automatically created for them — no manual work needed.

#### Vocabulary progress
Every time a user completes a word, a small record is saved:

| What's saved | Example |
|---|---|
| Which user | `a1b2-c3d4...` (anonymous ID) |
| Which word | `net-zero` |
| Completed? | Yes |
| When | 4 June 2026, 10:32am |

#### Collaboration (future features)
The database is also set up for upcoming collaborative features — workshop cohorts, glossary contributions, and translation tasks. These tables exist and are ready but don't have a frontend yet.

---

## How the vocabulary file and database connect

The word ID (called a "slug") is the bridge between the two systems. For example:

```
Vocabulary file knows:   net-zero → "Net Zero" → 净零排放 → definition → quiz answers
Database knows:          user abc123 completed net-zero on 4 June 2026
```

When a user loads their progress page, the app:
1. Fetches their completed word IDs from the database
2. Looks up the full details for each word from the vocabulary file
3. Displays everything together

---

## Privacy and security

- Every user can **only see their own data** — the database enforces this automatically
- **No social features** — there are no follower lists, public feeds, or direct messages
- Users collaborate through shared learning tasks and workshops, not through each other's profiles

---

## Pages and features at a glance

### Available now (no account needed)
- ✅ Home page with platform stats
- ✅ Full glossary with search, filter, and sort
- ✅ Flashcard deck (EN ↔ 中文, by category)
- ✅ Multiple-choice quiz
- ✅ Pinyin pronunciation guide
- ✅ Blog
- ✅ About, Events, Contact pages

### Available when logged in
- ✅ Personal progress dashboard (words learned, streaks, by category)
- ✅ Language goals form
- ✅ Workshop matching form (for in-person pairing)

### Coming soon
- 🔜 Fill-in-the-blank quiz mode (see [issue #1](../../issues/1))
- 🔜 Glossary contributions (suggest improved translations)
- 🔜 Workshop cohorts (join a learning group with a code)
- 🔜 Collaborative translation tasks

---

## Deployment status

| Step | Status |
|---|---|
| Vocabulary data (149 words, all fields) | ✅ Done |
| Database schema (users, progress, collaboration) | ✅ Live on Supabase |
| Frontend (Next.js app, all pages) | ✅ Built |
| Deploy to Vercel | 🔜 [Issue #10](../../issues/10) |
| Configure Supabase auth for production | 🔜 [Issue #9](../../issues/9) |
| Connect custom domain | 🔜 [Issue #11](../../issues/11) |
| Wire live stats to home page | 🔜 [Issue #7](../../issues/7) |
| Swap localStorage → Supabase progress | 🔜 [Issue #8](../../issues/8) |

---

## How to make content changes

### Adding or editing a blog post
Blog posts live in `content/blog/` as plain text files. To add one:
1. Go to `content/blog/` on GitHub
2. Click **Add file → Create new file**
3. Name it `your-post-title.mdx`
4. Write your content (see an existing post for the format)
5. Click **Commit changes** — the site rebuilds automatically

### Adding new vocabulary words
1. Open `Vocabulary List.xlsx` and add new rows
2. Run `python3 scripts/generate_vocabulary.py`
3. Commit and push the updated `data/vocabulary.json`
4. No database changes needed

### Updating team photos or images
Drop new images into the `public/` folder, commit, and push.

---

## Project structure

```
nscd-web/
│
├── 📄 data/
│   └── vocabulary.json          All 149 climate terms (the shared textbook)
│
├── 📄 content/
│   └── blog/                    Blog posts as plain text files (.mdx)
│
├── 📄 public/                   Images, logos, QiQi artwork
│
├── 📄 app/                      Every page of the website
│   ├── page.tsx                 Home
│   ├── about/                   About page
│   ├── learning/                Glossary, flashcards, quiz, pinyin guide
│   ├── account/                 Dashboard, goals, matching, progress
│   ├── blog/                    Blog index and posts
│   └── auth/                    Sign up, log in, email callback
│
├── 📄 components/               Reusable building blocks for each page
│
├── 📄 lib/                      Behind-the-scenes logic
│   ├── supabase/                Database helpers
│   │   ├── client.ts            Opens the connection to Supabase
│   │   ├── types.ts             Describes the shape of the data
│   │   ├── vocabulary-progress.ts  Mark/unmark/check word completion
│   │   └── stats.ts             Live platform stats for the home page
│   ├── progress/                Progress tracking (localStorage fallback)
│   ├── auth/                    Login and session management
│   └── vocabulary/              Reads from vocabulary.json
│
├── 📄 scripts/
│   └── generate_vocabulary.py   Converts the Excel file → vocabulary.json
│
└── 📄 supabase/
    ├── migrations/
    │   ├── 001_initial_schema.sql    User profiles + vocabulary progress
    │   ├── 002_platform_stats.sql    Live stats function for home page
    │   └── 003_collaboration_schema.sql  Cohorts, tasks, contributions
    └── README.md                Detailed backend architecture notes
```

---

## The team

| Name | Role |
|---|---|
| **Hailin Wang** 王海琳 | Co-founder, backend & data |
| **Junhua Qu** 曲君华 | Co-founder, product & vision |

Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [Supabase](https://supabase.com).
