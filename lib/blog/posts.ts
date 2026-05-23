/**
 * File-system blog loader.
 *
 * Posts live as MDX files in /content/blog/*.mdx with YAML frontmatter:
 *
 *   ---
 *   title: "Welcome to NSCD"
 *   date: "2026-05-23"
 *   author: "The NSCD team"
 *   authorRole: "Editor"
 *   excerpt: "A short paragraph that appears on the listing page."
 *   tags: ["intro", "vocabulary"]
 *   cover: "/blog/welcome.jpg"     # optional
 *   ---
 *
 * Anything after the closing `---` is the markdown body.
 *
 * This file is intentionally Node-only — it reads from disk via fs/path.
 * Don't import it from client components.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface PostFrontmatter {
  title: string;
  date: string;          // ISO date string YYYY-MM-DD
  author: string;
  authorRole?: string;
  excerpt: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  body: string;          // raw MDX body (frontmatter stripped)
}

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function ensureDir(): boolean {
  return fs.existsSync(POSTS_DIR);
}

function listMdxFiles(): string[] {
  if (!ensureDir()) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_") && !f.startsWith("."));
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, "");
}

function estimateReadingMinutes(body: string): number {
  // Roughly 200 words per minute for English; round up; minimum 1.
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseFile(filename: string): Post {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  // Be tolerant about naming so post authors can use either
  // `excerpt` / `summary` and `cover` / `coverImage`.
  const fmRaw = data as Record<string, unknown>;
  const fm = fmRaw as Partial<PostFrontmatter> & {
    summary?: string;
    coverImage?: string;
  };
  if (!fm.title) throw new Error(`Post ${filename}: missing "title" in frontmatter`);
  if (!fm.date) throw new Error(`Post ${filename}: missing "date" in frontmatter`);

  return {
    slug: slugFromFilename(filename),
    title: fm.title,
    date: fm.date,
    author: fm.author ?? "NSCD",
    authorRole: fm.authorRole,
    excerpt: fm.excerpt ?? fm.summary ?? "",
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    cover: fm.cover ?? fm.coverImage,
    coverAlt: fm.coverAlt,
    readingMinutes: estimateReadingMinutes(content),
    body: content,
  };
}

/**
 * Return all posts sorted by date descending (newest first).
 * Frontmatter only — body excluded for the list page.
 */
export function getAllPostsMeta(): PostMeta[] {
  return listMdxFiles()
    .map(parseFile)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ body, ...meta }) => meta);
}

/** Return a single post (frontmatter + body) by slug, or null if not found. */
export function getPostBySlug(slug: string): Post | null {
  const filename = `${slug}.mdx`;
  const filePath = path.join(POSTS_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return parseFile(filename);
}

/** Adjacent posts for next/prev navigation in the post footer. */
export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const all = getAllPostsMeta();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  // The list is newest-first. "Next" (older) is at idx+1; "prev" (newer) is at idx-1.
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

/** Format a YYYY-MM-DD date as e.g. "May 23, 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
