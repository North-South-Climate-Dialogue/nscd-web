import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";
import { formatDate } from "@/lib/blog/posts";

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block px-6 py-8 md:px-8 md:py-10 border-b border-ink/15 last:border-b-0 transition-[padding,border-color,background] hover:bg-[#FAF6EC] hover:border-l-4 hover:border-l-coral hover:pl-5 md:hover:pl-7"
    >
      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8 items-start">
        {/* Date column */}
        <div className="label-mono text-sage pt-2">
          <div className="text-ink">{formatDate(post.date)}</div>
          <div className="mt-1 text-sage">
            {post.readingMinutes} min read
          </div>
        </div>

        {/* Title + excerpt + meta */}
        <div className="min-w-0">
          <h2
            className="font-display font-extrabold text-ink text-[28px] md:text-[38px] leading-[1.05] tracking-tight normal-case"
            style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p
              className="mt-3 text-ink/80 text-[16px] md:text-[17px] leading-[1.6] max-w-[70ch]"
              style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
            >
              {post.excerpt}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 label-mono text-sage">
            <span>
              By <span className="text-ink">{post.author}</span>
              {post.authorRole && <span> · {post.authorRole}</span>}
            </span>
            {post.tags.length > 0 && (
              <span className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-ink/40 px-2 py-0.5 text-[10.5px] tracking-[0.12em] normal-case"
                    style={{ textTransform: "none" }}
                  >
                    #{t}
                  </span>
                ))}
              </span>
            )}
            <span className="ml-auto text-coral group-hover:text-ink transition-colors">
              Read →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
