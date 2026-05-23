import BlogIndexHeader from "@/components/blog/BlogIndexHeader";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPostsMeta } from "@/lib/blog/posts";

export const metadata = {
  title: "Blog · NSCD",
  description:
    "Field notes from the North South Climate Dialogue — essays on bilingual climate vocabulary, workshop recaps, and conversations from our community.",
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <>
      <BlogIndexHeader postCount={posts.length} />

      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-10">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="border-2 border-ink bg-paper shadow-thunk-lg">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="border-2 border-dashed border-ink/40 bg-paper p-12 md:p-16 text-center shadow-thunk-lg">
      <div className="font-display font-extrabold text-ink text-[40px] md:text-[64px] leading-[0.95] tracking-tight">
        No posts yet.
      </div>
      <p className="mt-5 max-w-[48ch] mx-auto text-ink/75 text-[16px] leading-[1.55]">
        We&apos;re writing the first one. New posts will appear here as they go
        live.
      </p>
    </div>
  );
}
