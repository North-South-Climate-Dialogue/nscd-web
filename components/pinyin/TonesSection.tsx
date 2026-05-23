import { TONES, TONE_DEMO } from "@/lib/pinyin/reference";

export default function TonesSection() {
  return (
    <section className="py-20 border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="label-mono text-coral mb-3.5">Tones</div>
        <h2 className="display text-ink text-[40px] md:text-[72px] leading-[0.95] max-w-[20ch] normal-case font-extrabold tracking-tight">
          Four tones. One syllable. Four meanings.
        </h2>
        <p className="mt-5 max-w-[68ch] text-[17px] leading-[1.55] text-ink/80">
          Mandarin uses pitch — going up, holding flat, dipping, or falling
          sharply — to tell similar-sounding words apart. The tone mark sits
          on top of the vowel. There&apos;s also a neutral tone (no mark) that
          sits soft and short.
        </p>

        {/* Four tone cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TONES.map((t) => (
            <article
              key={t.n}
              className="border-2 border-ink bg-paper p-6 shadow-thunk-lg"
            >
              <div className="flex items-baseline justify-between">
                <div className="label-mono text-sage">{t.name}</div>
                <div className="font-mono text-coral text-2xl font-bold">{t.n}</div>
              </div>
              <div className="mt-4 font-display font-extrabold text-ink text-[88px] leading-none">
                {t.mark}
              </div>
              <p className="mt-4 text-ink text-[15px] leading-[1.55]">{t.desc}</p>
              <p className="mt-3 italic text-sage text-[14px]">{t.feel}</p>
            </article>
          ))}
        </div>

        {/* mā má mǎ mà callout */}
        <div className="mt-12 border-2 border-ink bg-coral/15 p-8 shadow-thunk-lg">
          <div className="label-mono text-coral mb-3">Why tones matter</div>
          <h3 className="font-display font-extrabold text-ink text-[28px] md:text-[36px] leading-tight tracking-tight normal-case">
            Same letters. Different tones. Wildly different meanings.
          </h3>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {TONE_DEMO.map((d) => (
              <div
                key={d.pinyin}
                className="border-2 border-ink bg-paper p-5 text-center"
              >
                <div className="font-display font-extrabold text-ink text-[44px] leading-none">
                  {d.pinyin}
                </div>
                <div className="mt-2 font-zh text-green-deep text-3xl">{d.char}</div>
                <div className="mt-2 label-mono text-sage">{d.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
