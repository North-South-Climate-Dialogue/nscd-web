import type { SoundEntry } from "@/lib/pinyin/reference";

/**
 * Reference grid laid out as 4 columns on desktop — pairs of (letter, meaning)
 * side by side, two sounds per row. Stacks to 2 columns on mobile.
 */
export default function SoundTable({
  eyebrow,
  title,
  blurb,
  entries,
  trailing,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  entries: SoundEntry[];
  trailing?: React.ReactNode;
}) {
  // Pair entries up: [a,b,c,d,e] → [[a,b],[c,d],[e,undefined]]
  const pairs: [SoundEntry, SoundEntry | undefined][] = [];
  for (let i = 0; i < entries.length; i += 2) {
    pairs.push([entries[i], entries[i + 1]]);
  }

  return (
    <section className="py-20 border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="label-mono text-coral mb-3.5">{eyebrow}</div>
        <h2 className="display text-ink text-[40px] md:text-[64px] leading-[0.95] max-w-[20ch] normal-case font-extrabold tracking-tight">
          {title}
        </h2>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.55] text-ink/80">
          {blurb}
        </p>

        <div className="mt-10 border-2 border-ink bg-paper shadow-thunk-lg">
          {/* Header — 4 columns */}
          <div className="hidden md:grid grid-cols-[80px_1fr_80px_1fr] gap-x-5 items-center px-6 py-3.5 border-b-2 border-ink label-mono text-sage">
            <span>Letter</span>
            <span>Sounds like…</span>
            <span>Letter</span>
            <span>Sounds like…</span>
          </div>

          {pairs.map(([a, b], rowIdx) => (
            <div
              key={a.letter}
              className={`grid grid-cols-1 md:grid-cols-[80px_1fr_80px_1fr] gap-x-5 gap-y-2 px-6 py-4 ${
                rowIdx < pairs.length - 1 ? "border-b border-ink/15" : ""
              }`}
            >
              <Cell entry={a} />
              {b ? (
                <Cell entry={b} />
              ) : (
                // Empty pair: keep the row balanced on desktop
                <>
                  <div className="hidden md:block" />
                  <div className="hidden md:block" />
                </>
              )}
            </div>
          ))}
        </div>

        {trailing && <div className="mt-6">{trailing}</div>}
      </div>
    </section>
  );
}

function Cell({ entry }: { entry: SoundEntry }) {
  return (
    <>
      <div className="font-display font-extrabold text-coral text-[40px] leading-none md:pr-2">
        {entry.letter}
      </div>
      <div>
        <p className="text-ink text-[15px] md:text-[16px] leading-[1.5]">
          {entry.similar}
        </p>
        {entry.note && (
          <p className="mt-1 label-mono text-sage normal-case tracking-normal text-[12px]">
            {entry.note}
          </p>
        )}
      </div>
    </>
  );
}
