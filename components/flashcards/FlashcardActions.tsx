"use client";

export default function FlashcardActions({
  flipped,
  learned,
  onAgain,
  onGood,
  onMastered,
}: {
  flipped: boolean;
  learned: boolean;
  onAgain: () => void;
  onGood: () => void;
  onMastered: () => void;
}) {
  return (
    <div
      className={`grid grid-cols-3 gap-3 md:gap-4 transition-opacity duration-300 ${
        flipped ? "opacity-100" : "opacity-40 pointer-events-none"
      }`}
      aria-hidden={!flipped}
    >
      <Action
        kbd="1"
        label="Again"
        sublabel="Re-queue · keep practicing"
        onClick={onAgain}
        tone="paper"
      />
      <Action
        kbd="2"
        label="Good"
        sublabel="Move on · revisit later"
        onClick={onGood}
        tone="paper"
      />
      <Action
        kbd="3"
        label={learned ? "Mastered ✓" : "Mastered"}
        sublabel="Mark learned · advance"
        onClick={onMastered}
        tone={learned ? "ink" : "coral"}
      />
    </div>
  );
}

function Action({
  kbd,
  label,
  sublabel,
  onClick,
  tone,
}: {
  kbd: string;
  label: string;
  sublabel: string;
  onClick: () => void;
  tone: "paper" | "coral" | "ink";
}) {
  const bg =
    tone === "coral"
      ? "bg-coral text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C]"
      : tone === "ink"
        ? "bg-ink text-paper"
        : "bg-paper text-ink hover:bg-[#FAF6EC]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-2 border-ink px-3 md:px-5 py-4 transition-all text-left ${bg}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display font-extrabold text-[20px] md:text-[26px] leading-none tracking-tight">
          {label}
        </span>
        <span className="font-mono text-[11px] md:text-[12px] opacity-70 border border-current px-1.5 py-0.5 leading-none">
          {kbd}
        </span>
      </div>
      <div className="mt-2 label-mono opacity-80 normal-case tracking-normal text-[11px]">
        {sublabel}
      </div>
    </button>
  );
}
