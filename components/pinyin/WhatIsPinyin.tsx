export default function WhatIsPinyin() {
  return (
    <section className="py-20 border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 items-start">
        <div>
          <div className="label-mono text-coral mb-3.5">What is pinyin</div>
          <h2 className="display text-ink text-[40px] md:text-[64px] leading-[0.95] max-w-[18ch] normal-case font-extrabold tracking-tight">
            A roman-letter map for spoken Chinese.
          </h2>
        </div>
        <div className="prose-base max-w-[60ch] text-ink">
          <p className="text-[17px] leading-[1.65]">
            In Chinese, a syllable is built from three parts —{" "}
            <strong className="text-green-deep">an initial</strong>,{" "}
            <strong className="text-green-deep">a final</strong>, and{" "}
            <strong className="text-green-deep">a tone</strong>. Most syllables
            start with a consonant (the initial) followed by one or more
            vowel sounds (the final). The tone sits on the vowel and changes
            the meaning of the whole word.
          </p>
          <p className="mt-5 text-[17px] leading-[1.65]">
            Most consonants in pinyin sound roughly like their English
            counterparts — but a handful read very differently. Read pinyin
            as <em>pinyin</em>, not as English.
          </p>
          <p className="mt-5 text-[15px] leading-[1.65] text-sage italic">
            Pronunciation tip: when you see a syllable in the glossary, say
            the initial, then the final, then add the tone shape on top.
          </p>
        </div>
      </div>
    </section>
  );
}
