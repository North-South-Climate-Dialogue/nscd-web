import { TRICKY } from "@/lib/pinyin/reference";

export default function TrickySounds() {
  return (
    <section className="py-20 border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="label-mono text-coral mb-3.5">Start here</div>
        <h2 className="display text-ink text-[40px] md:text-[72px] leading-[0.95] max-w-[20ch] normal-case font-extrabold tracking-tight">
          Five sounds that trip up English speakers.
        </h2>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.55] text-ink/80">
          If you only remember a handful of pinyin sounds before reading the
          glossary, make it these. Each one shows up in the climate vocabulary
          regularly and reads nothing like its English letter would suggest.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRICKY.map((t) => (
            <article
              key={t.pinyin}
              className="border-2 border-ink bg-paper p-6 shadow-thunk-lg"
            >
              <div className="flex items-end justify-between gap-2">
                <div className="font-display font-extrabold text-coral text-[80px] leading-none">
                  {t.pinyin}
                </div>
                <div className="label-mono text-sage pb-2">Pinyin</div>
              </div>
              <p className="mt-4 text-ink text-[15px] leading-[1.55]">
                {t.hint}
              </p>
              <div className="mt-5 pt-4 border-t-2 border-dashed border-ink/40">
                <div className="label-mono text-sage mb-1.5">Example</div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-zh text-ink text-2xl font-medium">{t.example.chinese}</span>
                  <span className="font-sans italic text-sage text-base">{t.example.pinyin}</span>
                </div>
                <div className="mt-1.5 text-ink/70 text-sm">{t.example.en}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
