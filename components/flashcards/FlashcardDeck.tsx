"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { VocabEntry } from "@/types/vocabulary";
import { catSlug } from "@/lib/glossary/filters";
import { useProgress } from "@/hooks/useProgress";
import Flashcard, { type FlipDirection } from "./Flashcard";
import FlashcardToolbar from "./FlashcardToolbar";
import FlashcardActions from "./FlashcardActions";
import FlashcardDone from "./FlashcardDone";

/* Fisher-Yates shuffle on a copy of the array. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function FlashcardDeck({ entries }: { entries: VocabEntry[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { learnedIds, mark } = useProgress();

  const cat = searchParams.get("cat") ?? "";

  const [direction, setDirection] = useState<FlipDirection>("en-to-zh");
  const [reshuffleSeed, setReshuffleSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // Server-render with the filtered-but-unshuffled deck so the first card
  // appears immediately. Shuffling (which uses Math.random) only happens on
  // the client in the useEffect below, where it can't cause SSR mismatches.
  const [deck, setDeck] = useState<VocabEntry[]>(() =>
    cat ? entries.filter((e) => catSlug(e.category) === cat) : entries,
  );
  // Track which IDs the user clicked "Mastered" on during this round.
  const [masteredThisRound, setMasteredThisRound] = useState<Set<string>>(
    () => new Set(),
  );

  // Build (and rebuild on filter / reshuffle) the deck for this session.
  useEffect(() => {
    const filtered = cat
      ? entries.filter((e) => catSlug(e.category) === cat)
      : entries;
    setDeck(shuffle(filtered));
    setCurrentIndex(0);
    setFlipped(false);
    setMasteredThisRound(new Set());
    // reshuffleSeed only forces a re-run; we intentionally don't depend on it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, cat, reshuffleSeed]);

  const currentEntry = deck[currentIndex];
  const isDone = deck.length > 0 && currentIndex >= deck.length;

  const writeCat = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("cat", next);
      else params.delete("cat");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleFlip = useCallback(() => setFlipped((v) => !v), []);

  const advance = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => i + 1);
  }, []);

  const handleAgain = useCallback(() => {
    setDeck((d) => {
      if (currentIndex < 0 || currentIndex >= d.length) return d;
      const copy = [...d];
      const card = copy.splice(currentIndex, 1)[0];
      const insertAt = Math.min(currentIndex + 3, copy.length);
      copy.splice(insertAt, 0, card);
      return copy;
    });
    setFlipped(false);
    // currentIndex stays — the next card already slid into this slot.
  }, [currentIndex]);

  const handleGood = useCallback(() => advance(), [advance]);

  const handleMastered = useCallback(async () => {
    if (currentEntry) {
      await mark(currentEntry.id);
      setMasteredThisRound((s) => new Set(s).add(currentEntry.id));
    }
    advance();
  }, [advance, currentEntry, mark]);

  const handlePrev = useCallback(() => {
    setFlipped(false);
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => advance(), [advance]);

  const handleReshuffle = useCallback(() => setReshuffleSeed((s) => s + 1), []);

  // Keyboard shortcuts
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Ignore when typing in a control
      const ae = document.activeElement as HTMLElement | null;
      if (ae) {
        const tag = ae.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      }
      if (isDone) return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (flipped) {
        if (e.key === "1") {
          e.preventDefault();
          handleAgain();
        } else if (e.key === "2") {
          e.preventDefault();
          handleGood();
        } else if (e.key === "3") {
          e.preventDefault();
          void handleMastered();
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    isDone,
    flipped,
    handleFlip,
    handlePrev,
    handleNext,
    handleAgain,
    handleGood,
    handleMastered,
  ]);

  const progressPct = useMemo(
    () =>
      deck.length === 0
        ? 0
        : Math.min(100, Math.round((currentIndex / deck.length) * 100)),
    [currentIndex, deck.length],
  );

  return (
    <>
      <FlashcardToolbar
        cat={cat}
        direction={direction}
        onChangeCat={writeCat}
        onChangeDirection={setDirection}
        onReshuffle={handleReshuffle}
      />

      <section className="max-w-[820px] mx-auto px-6 md:px-8 py-10">
        {/* Progress bar */}
        <div className="flex items-center gap-3 label-mono text-sage mb-3">
          <span>
            Round progress
          </span>
          <div className="flex-1 h-1.5 bg-ink/15 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-coral transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
              aria-hidden
            />
          </div>
          <span>{progressPct}%</span>
        </div>

        {deck.length === 0 ? (
          <EmptyDeck onClearCat={() => writeCat("")} catActive={cat !== ""} />
        ) : isDone ? (
          <FlashcardDone
            mastered={masteredThisRound.size}
            total={deck.length}
            onRestart={handleReshuffle}
          />
        ) : (
          currentEntry && (
            <>
              <Flashcard
                entry={currentEntry}
                flipped={flipped}
                direction={direction}
                position={currentIndex + 1}
                total={deck.length}
                onFlip={handleFlip}
              />

              <div className="mt-6">
                <FlashcardActions
                  flipped={flipped}
                  learned={learnedIds.has(currentEntry.id)}
                  onAgain={handleAgain}
                  onGood={handleGood}
                  onMastered={handleMastered}
                />
              </div>

              <div className="mt-6 flex items-center justify-between label-mono text-sage">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="hover:text-coral disabled:opacity-40 disabled:hover:text-sage"
                >
                  ← Previous card
                </button>
                <span>Space flips · ← → moves · 1 2 3 acts</span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="hover:text-coral"
                >
                  Skip →
                </button>
              </div>
            </>
          )
        )}
      </section>
    </>
  );
}

function EmptyDeck({ onClearCat, catActive }: { onClearCat: () => void; catActive: boolean }) {
  return (
    <div className="border-2 border-dashed border-ink/40 bg-paper p-10 text-center shadow-thunk-lg">
      <div className="font-display font-extrabold text-ink text-[40px] md:text-[56px] leading-[0.95] tracking-tight">
        Nothing in this deck.
      </div>
      <p className="mt-4 max-w-[44ch] mx-auto text-ink/75">
        {catActive
          ? "No terms in this category yet. Try a different one, or clear the category to see every term."
          : "No vocabulary available. Add some terms to data/vocabulary.json."}
      </p>
      {catActive && (
        <button
          type="button"
          onClick={onClearCat}
          className="mt-6 inline-block bg-coral border-2 border-ink px-5 py-3 font-extrabold uppercase tracking-[0.1em] text-[13px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
        >
          Clear category
        </button>
      )}
    </div>
  );
}
