"use client";

import type { VocabEntry } from "@/types/vocabulary";
import CategoryTag from "@/components/glossary/CategoryTag";

export type FlipDirection = "en-to-zh" | "zh-to-en";

/**
 * The big focal card. Uses a CSS 3D rotation so the back appears in place when
 * the front flips out. Click anywhere on the card to flip.
 */
export default function Flashcard({
  entry,
  flipped,
  direction,
  position,
  total,
  onFlip,
}: {
  entry: VocabEntry;
  flipped: boolean;
  direction: FlipDirection;
  position: number;
  total: number;
  onFlip: () => void;
}) {
  return (
    <div
      className="card-perspective select-none"
      style={{ perspective: "1400px" }}
    >
      <button
        type="button"
        onClick={onFlip}
        aria-label={flipped ? "Hide answer" : "Reveal answer"}
        aria-pressed={flipped}
        className="block w-full text-left focus:outline-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative w-full h-[420px] md:h-[480px] transition-transform duration-500 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT */}
          <Face>
            <FaceHeader entry={entry} position={position} total={total} side="front" />
            <div className="flex-1 flex items-center justify-center px-6 py-2">
              <div className="text-center">
                {direction === "en-to-zh" ? (
                  <div className="font-display font-extrabold text-ink text-[56px] md:text-[80px] leading-[1] tracking-tight normal-case break-words">
                    {entry.word}
                  </div>
                ) : (
                  <>
                    <div className="font-zh font-bold text-ink text-[64px] md:text-[88px] leading-none">
                      {entry.chineseTranslation}
                    </div>
                    {entry.pinyin && (
                      <div className="mt-3 font-sans italic text-sage text-xl md:text-2xl">
                        {entry.pinyin}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <FaceFooter hint="Click to reveal · Space" />
          </Face>

          {/* BACK */}
          <Face back>
            <FaceHeader entry={entry} position={position} total={total} side="back" />
            <div className="flex-1 overflow-y-auto px-6 py-3">
              {direction === "en-to-zh" ? (
                <>
                  <div className="font-zh font-bold text-ink text-[44px] md:text-[56px] leading-tight">
                    {entry.chineseTranslation}
                  </div>
                  {entry.pinyin && (
                    <div className="mt-1 font-sans italic text-sage text-lg md:text-xl">
                      {entry.pinyin}
                    </div>
                  )}
                </>
              ) : (
                <div className="font-display font-extrabold text-ink text-[40px] md:text-[52px] leading-tight tracking-tight normal-case">
                  {entry.word}
                </div>
              )}

              {entry.pronunciation && (
                <section className="mt-4 border-l-4 border-coral pl-4 py-1.5">
                  <div className="label-mono text-coral mb-1">Say it · English guide</div>
                  <p className="text-ink text-[14px] md:text-[15px] leading-[1.55]">
                    {entry.pronunciation}
                  </p>
                </section>
              )}

              <section className="mt-4">
                <div className="label-mono text-sage mb-1">Definition</div>
                <p className="text-ink text-[14px] md:text-[15px] leading-[1.55]">
                  {entry.description}
                </p>
              </section>

              {entry.example && (
                <section className="mt-4">
                  <div className="label-mono text-sage mb-1">Example</div>
                  <div className="border-l-2 border-ink/30 pl-3 space-y-1.5">
                    <p className="font-zh text-ink text-[15px] md:text-[16px] leading-[1.7]">
                      {entry.example}
                    </p>
                    {entry.exampleEnglish && (
                      <p className="text-ink/70 text-[13px] md:text-[14px] leading-[1.55] italic">
                        {entry.exampleEnglish}
                      </p>
                    )}
                  </div>
                </section>
              )}
            </div>
            <FaceFooter hint="Click to hide · Space" />
          </Face>
        </div>
      </button>
    </div>
  );
}

function Face({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 border-2 border-ink bg-paper shadow-thunk-lg flex flex-col"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

function FaceHeader({
  entry,
  position,
  total,
  side,
}: {
  entry: VocabEntry;
  position: number;
  total: number;
  side: "front" | "back";
}) {
  return (
    <header className="flex items-start justify-between px-6 py-4 border-b-2 border-ink">
      <div className="font-mono text-[12px] tracking-wider text-sage">
        Card{" "}
        <span className="text-ink font-semibold">
          {String(position).padStart(2, "0")}
        </span>{" "}
        / {total} · <span className="uppercase">{side}</span>
      </div>
      <CategoryTag category={entry.category} />
    </header>
  );
}

function FaceFooter({ hint }: { hint: string }) {
  return (
    <footer className="border-t-2 border-ink px-6 py-3 label-mono text-sage text-center">
      {hint}
    </footer>
  );
}
