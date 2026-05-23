import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/blog/posts";
import { formatDate } from "@/lib/blog/posts";

export default function BlogPostHeader({ post }: { post: PostMeta }) {
  return (
    <header className="bg-paper border-b-2 border-ink">
      {post.cover && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-10 md:pt-14">
          <div className="border-2 border-ink shadow-thunk-lg overflow-hidden">
            <Image
              src={post.cover}
              alt={post.coverAlt ?? post.title}
              width={1600}
              height={900}
              priority
              className="block w-full h-auto"
            />
          </div>
          {post.coverAlt && (
            <p className="mt-3 label-mono text-sage normal-case tracking-normal text-[12px] italic">
              {post.coverAlt}
            </p>
          )}
        </div>
      )}

      <div className="max-w-[820px] mx-auto px-6 md:px-8 py-14 md:py-20">
        <div className="label-mono text-coral mb-3.5">
          <Link href="/blog" className="hover:text-ink transition-colors">
            Blog
          </Link>
          <span className="mx-2 text-ink/30">·</span>
          <span className="text-sage">{formatDate(post.date)}</span>
        </div>

        <h1
          className="font-display font-extrabold text-ink text-[44px] md:text-[72px] leading-[1.02] tracking-tight normal-case"
          style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
        >
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 label-mono text-sage">
          <span>
            By <span className="text-ink">{post.author}</span>
            {post.authorRole && <span> · {post.authorRole}</span>}
          </span>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
          {post.tags.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="border border-ink/40 px-2 py-0.5 text-[10.5px] tracking-[0.12em]"
                  style={{ textTransform: "none" }}
                >
                  #{t}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
