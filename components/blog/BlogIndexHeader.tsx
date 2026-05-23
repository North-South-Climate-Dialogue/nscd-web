export default function BlogIndexHeader({ postCount }: { postCount: number }) {
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-16 md:py-20">
        <div className="label-mono text-coral mb-3.5">Our work · Blog</div>
        <h1 className="display text-ink text-[56px] md:text-[96px] leading-[0.92] max-w-[18ch] normal-case font-extrabold tracking-tight">
          Field notes from a bilingual climate dialogue.
        </h1>
        <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.55] text-ink/80">
          Essays on the words we use to talk about climate, recaps of the
          in-person workshops, and conversations with the people building NSCD.
          Written for English readers, Mandarin readers, and the curious
          in-between.
        </p>
        <p className="mt-7 label-mono text-sage">
          {postCount === 0
            ? "No posts yet · check back soon"
            : `${postCount} ${postCount === 1 ? "post" : "posts"} · newest first`}
        </p>
      </div>
    </section>
  );
}
