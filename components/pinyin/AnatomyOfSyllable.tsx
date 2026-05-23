/**
 * Big featured breakdown of one syllable — chosen example: 气 from 气候 (climate).
 * Shows all five parts: initial, final, tone, syllable, character.
 */
export default function AnatomyOfSyllable() {
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-20">
        <div className="label-mono text-coral mb-3.5">Anatomy of a syllable</div>
        <h2 className="display text-ink text-[40px] md:text-[64px] leading-[0.95] max-w-[20ch] normal-case font-extrabold tracking-tight">
          One syllable, broken open.
        </h2>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.55] text-ink/80">
          The first syllable of <span className="font-zh font-medium">气候</span> (qì hòu, “climate”).
          Read left to right — initial, final, tone — to build the whole sound.
        </p>

        {/* Big breakdown */}
        <div className="mt-12 flex flex-wrap items-stretch justify-center gap-3 md:gap-5">
          <Part label="Initial" value="q" />
          <Connector symbol="+" />
          <Part label="Final" value="i" />
          <Connector symbol="+" />
          <Part label="Tone (4th)" value="ˋ" subtitle="Falling" />
          <Connector symbol="=" />
          <Part label="Syllable" value="qì" tint="green" big />
          <Connector symbol="→" />
          <Part label="Character" value="气" tint="coral" big chinese />
        </div>

        <p className="mt-10 max-w-[68ch] mx-auto text-center text-ink/70 text-[15px] leading-[1.6]">
          The fourth tone falls sharply from high to low — a confident, decisive sound.
          Layer it on top of the final vowel to finish the syllable.
        </p>
      </div>
    </section>
  );
}

function Part({
  label,
  value,
  subtitle,
  tint = "paper",
  big = false,
  chinese = false,
}: {
  label: string;
  value: string;
  subtitle?: string;
  tint?: "paper" | "green" | "coral";
  big?: boolean;
  chinese?: boolean;
}) {
  const bg =
    tint === "green"
      ? "bg-green text-paper"
      : tint === "coral"
        ? "bg-coral text-ink"
        : "bg-paper text-ink";

  return (
    <div className="flex flex-col items-center">
      <div className="label-mono text-sage mb-2 whitespace-nowrap">{label}</div>
      <div
        className={`border-2 border-ink shadow-thunk ${bg} ${
          big ? "w-[140px] h-[140px] md:w-[170px] md:h-[170px]" : "w-[110px] h-[140px] md:w-[130px] md:h-[170px]"
        } flex items-center justify-center`}
      >
        <span
          className={`${chinese ? "font-zh" : "font-display"} font-extrabold leading-none ${
            big ? "text-[88px] md:text-[112px]" : "text-[72px] md:text-[88px]"
          }`}
        >
          {value}
        </span>
      </div>
      {subtitle && (
        <div className="mt-2 label-mono text-coral whitespace-nowrap">{subtitle}</div>
      )}
    </div>
  );
}

function Connector({ symbol }: { symbol: string }) {
  return (
    <div className="flex items-center justify-center self-center pt-7 md:pt-8">
      <span
        aria-hidden
        className="font-display font-extrabold text-ink/40 text-[40px] md:text-[56px] leading-none select-none"
      >
        {symbol}
      </span>
    </div>
  );
}
