# NSCD Frontend — Developer Guide

This guide covers everything you need to run, update, and extend the NSCD web
frontend. The backend folders (`data/`, `lib/supabase/`, `supabase/`) are
documented in the main `README.md`; this file is about the Next.js app on top.

---

## Run it locally

```bash
# 1. Install dependencies (once)
npm install

# 2. Start the dev server
npm run dev
```

Open <http://localhost:3000>. Hot-reload is on; saving any file refreshes the
page automatically.

### Production build (optional sanity check)

```bash
npm run build
npm start
```

---

## Tech stack — the short version

| Concern | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS with custom design tokens (see `tailwind.config.ts`) |
| Fonts | `next/font` — Bricolage Grotesque (display), Plus Jakarta Sans (body), Noto Sans SC (中文), JetBrains Mono (numerics) |
| Data | `data/vocabulary.json` (149 climate terms); blog posts in `content/blog/*.mdx` |
| Auth | Supabase via `@supabase/ssr` (cookie sessions, middleware-refreshed) |
| Progress | localStorage today (`lib/progress/local.ts`); swap to Supabase later (`lib/supabase/vocabulary-progress.ts`) |

---

## Project structure

```
app/                       ← Next.js routes (page.tsx, layout.tsx, route.ts)
  page.tsx                 home
  about/, contact/, events/
  blog/
    page.tsx               /blog index
    [slug]/page.tsx        /blog/<slug>
  learning/
    glossary/, flashcards/, pinyin-guide/
  quiz/
  signup/, login/
  account/                 protected — layout.tsx is the auth guard
  auth/callback/route.ts   Supabase email-confirmation redirect handler

components/                ← one folder per feature
  layout/, home/, glossary/, flashcards/, quiz/, pinyin/, blog/, auth/, contact/

content/
  blog/                    ← MDX posts; one file = one URL

data/                      ← BACKEND OWNED — vocabulary.json lives here
lib/
  auth/                    Supabase clients + isAuthConfigured() helper
  blog/                    MDX loader + frontmatter parser
  glossary/, quiz/, pinyin/, vocabulary/  feature helpers
  progress/local.ts        localStorage progress shim (same signature as Supabase)
  supabase/                BACKEND OWNED — auth client + vocabulary_progress functions

middleware.ts              refreshes Supabase session cookies
public/                    static assets — logos, photos, QiQi
scripts/                   one-off Node scripts (image optimize, vocab regenerate)
hooks/                     React hooks (useProgress)
types/                     shared TS types
```

---

## Common updates — recipes

### Add a new vocabulary term

1. Edit the source spreadsheet (`Vocabulary_List_with_Example_English_Translation_complete.xlsx`).
2. Regenerate the JSON:
   ```bash
   node scripts/regenerate-vocab.mjs
   ```
   The script backs up the existing `data/vocabulary.json` to `.bak` (gitignored)
   and warns if any new strings ended up truncated. **Zero warnings = clean rebuild.**

### Add a new blog post

1. Create `content/blog/<slug>.mdx` — the filename becomes the URL. Use
   kebab-case, no spaces.
2. Add YAML frontmatter at the top:
   ```mdx
   ---
   title: "Your title"
   date: "2026-05-30"
   author: "Your name"
   authorRole: "Editor"          # optional
   excerpt: "1–2 sentence summary that shows on the index page."
   tags: ["workshop", "climate"]
   cover: "/blog/<slug>/cover.jpg"  # optional
   coverAlt: "Brief description of the cover image."  # optional
   ---
   ```
   The loader also accepts `summary` and `coverImage` as aliases.
3. Write the post in markdown. Headings, lists, blockquotes, inline code, and
   bilingual content all render through the Civic Poster prose styling in
   `components/blog/BlogProse.tsx`.
4. For images, drop them in `public/blog/<slug>/`, then reference with markdown
   syntax: `![alt text](/blog/<slug>/photo.jpg)`.

### Add images

1. Copy the originals into `public/<area>/<slug>/`.
2. Optimize them so they're git-friendly:
   ```bash
   node scripts/optimize-public-images.mjs
   ```
   This resizes JPGs to 1920px max width at quality 80 (typical 95%+ size reduction).
   Edit the `ROOTS` array in the script to include any new folders.

### Change site-wide colors / fonts

`tailwind.config.ts` is the single source of truth.
- Colors: `green`, `coral`, `paper`, `sage`, `ink`
- Font CSS variables: `--font-display`, `--font-sans`, `--font-zh`, `--font-mono`
  (loaded in `app/fonts.ts`)

### Configure Supabase (when ready)

1. Create a Supabase project; copy **Project URL** and **anon public** key.
2. In the repo root, copy `.env.local.example` → `.env.local` and paste the
   values. `.env.local` is gitignored.
3. In Supabase dashboard → Authentication → URL Configuration:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: add `http://localhost:3000/auth/callback`
   - When deploying, add the production URLs too.
4. Restart the dev server. The "Authentication isn't configured" warnings on
   `/signup` and `/login` will disappear; the navbar will start greeting
   signed-in users by name.

---

## Git workflow

```bash
# Pull latest from main before starting
git pull origin main

# Make your changes, then:
git status                       # see what changed
git add <files-you-want>         # or git add -A for everything
git commit -m "Short summary"
git push origin main
```

**Never commit** `.env.local`, `node_modules/`, `.next/`, or `*.bak` files
(all gitignored).

**Before pushing photos**: run `node scripts/optimize-public-images.mjs` so
they're web-sized.

---

## Deployment (when ready)

Recommended path: **Vercel** (free for personal/non-profit projects, made for Next.js).

1. Push the repo to GitHub.
2. Sign in to <https://vercel.com> with GitHub.
3. Import the `nscd-web` repository.
4. Add environment variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy. Every `git push` to `main` auto-deploys.

Other hosts that work out of the box: Netlify, Cloudflare Pages, self-hosted
Node.

---

## Things deliberately left for later

- Migrating localStorage progress to Supabase on first login
- Password reset / "forgot password" flow
- OAuth providers (Google, GitHub)
- Matching-interest form persistence in Supabase (currently a stub page)
- Full Profile / Goals pages under `/account/*`
- Site-wide language switcher (i18n)

Each of these can land in its own follow-up PR without touching the rest of
the app.
