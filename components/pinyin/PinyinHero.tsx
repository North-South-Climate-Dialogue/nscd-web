import Link from "next/link";

export default function PinyinHero() {
  return (
    <section className="bg-green text-paper border-b-[6px] border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-20 md:py-24">
        <div className="label-mono text-coral mb-3.5">Learning · Pinyin Guide</div>
        <h1 className="display text-paper text-[64px] md:text-[120px] leading-[0.9] tracking-tightest max-w-[16ch]">
          Simple Pinyin Guide.
        </h1>
        <p className="mt-7 max-w-[60ch] text-[18px] md:text-[20px] leading-[1.55] text-paper/85">
          Pinyin is the system that turns Chinese characters into letters you
          can read. Every climate term in our glossary has one. This page is a
          short field manual — how syllables work, the sounds that surprise
          English speakers, and the four tones.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <Link href="/learning/glossary" className="btn-primary">
            ← Back to glossary
          </Link>
        </div>
      </div>
    </section>
  );
}
