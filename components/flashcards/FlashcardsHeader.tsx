import Link from "next/link";

export default function FlashcardsHeader() {
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-12 md:py-16">
        <div className="label-mono text-coral mb-3.5">Learning · Flashcards</div>
        <h1 className="display text-ink text-[48px] md:text-[88px] leading-[0.92] max-w-[18ch] normal-case font-extrabold tracking-tight">
          Flip. Recall. Master.
        </h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.55] text-ink/80">
          A focused study mode for the climate vocabulary. One word at a
          time — flip the card to reveal the translation, pinyin, pronunciation
          hint, and a bilingual example. Mark what you&apos;ve mastered.
        </p>
        <div className="mt-7">
          <Link
            href="/learning/glossary"
            className="inline-block border-2 border-ink bg-paper px-5 py-3 font-extrabold uppercase tracking-[0.08em] text-[13px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-coral hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
          >
            ← Browse the full glossary
          </Link>
        </div>
      </div>
    </section>
  );
}
