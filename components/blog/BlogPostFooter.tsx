import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";
import { formatDate } from "@/lib/blog/posts";

export default function BlogPostFooter({
  prev,
  next,
}: {
  prev: PostMeta | null;
  next: PostMeta | null;
}) {
  return (
    <footer className="max-w-[820px] mx-auto px-6 md:px-8 pb-16">
      <div className="border-t-2 border-ink pt-8">
        <Link
          href="/blog"
          className="inline-block border-2 border-ink bg-paper px-5 py-3 font-extrabold uppercase tracking-[0.08em] text-[13px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-coral hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
        >
          ← Back to all posts
        </Link>

        {(prev || next) && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="block border-2 border-ink bg-paper p-5 md:p-6 transition-all hover:bg-[#FAF6EC] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-thunk"
              >
                <div className="label-mono text-coral mb-2">← Newer post</div>
                <div className="font-display font-extrabold text-ink text-[20px] md:text-[22px] leading-tight normal-case">
                  {prev.title}
                </div>
                <div className="mt-2 label-mono text-sage">
                  {formatDate(prev.date)}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="block border-2 border-ink bg-paper p-5 md:p-6 text-right transition-all hover:bg-[#FAF6EC] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-thunk"
              >
                <div className="label-mono text-coral mb-2">Older post →</div>
                <div className="font-display font-extrabold text-ink text-[20px] md:text-[22px] leading-tight normal-case">
                  {next.title}
                </div>
                <div className="mt-2 label-mono text-sage">
                  {formatDate(next.date)}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
