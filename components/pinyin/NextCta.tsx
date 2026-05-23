import Link from "next/link";

export default function NextCta() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-8 text-center">
        <div className="label-mono text-coral mb-3.5">Now try it</div>
        <h2 className="display text-ink text-[40px] md:text-[72px] leading-[0.95] max-w-[20ch] mx-auto normal-case font-extrabold tracking-tight">
          Read the climate glossary, out loud.
        </h2>
        <p className="mt-5 max-w-[60ch] mx-auto text-[17px] leading-[1.55] text-ink/80">
          Every term has a Chinese spelling, a pinyin syllable, and an
          English pronunciation hint. Open the side panel to see all three
          for any word.
        </p>
        <div className="mt-8">
          <Link
            href="/learning/glossary"
            className="bg-ink text-paper border-2 border-ink px-6 py-4 font-extrabold uppercase tracking-[0.08em] text-[14px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#23492A] transition-all inline-block"
          >
            Open the glossary →
          </Link>
        </div>
      </div>
    </section>
  );
}
