"use client";

import { useEffect, useRef } from "react";
import type { VocabEntry } from "@/types/vocabulary";
import CategoryTag from "./CategoryTag";

export default function GlossaryDetail({
  entry,
  position,
  total,
  learned,
  onClose,
  onPrev,
  onNext,
  onToggleLearned,
}: {
  entry: VocabEntry | null;
  position: number;             // 1-based position in filtered list, 0 if not found
  total: number;                // total in filtered list
  learned: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleLearned: () => void;
}) {
  const isOpen = entry !== null;
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Esc closes, ←/→ navigate
  useEffect(() => {
    if (!isOpen) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, onPrev, onNext]);

  // Focus the close button when the panel first opens so keyboard users land
  // somewhere sensible. We intentionally don't refocus on every entry change.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      closeButtonRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Body scroll lock on mobile only — desktop panel doesn't cover the list
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    if (window.matchMedia("(max-width: 767px)").matches) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 z-30 bg-ink/40 md:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-40 h-full w-full md:w-[460px] bg-paper border-l-2 border-ink shadow-[ -8px_0_0_#0E1F2C] transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {entry && (
          <div className="h-full flex flex-col">
            {/* Header bar */}
            <header className="flex items-center justify-between px-6 py-4 border-b-2 border-ink bg-paper">
              <div className="label-mono text-sage">
                Term <span className="text-ink font-semibold">{position}</span> of {total}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close detail"
                className="border-2 border-ink px-3 py-1.5 text-sm font-bold uppercase tracking-[0.08em] hover:bg-ink hover:text-paper focus:bg-ink focus:text-paper focus:outline-none transition-colors"
              >
                Close ✕
              </button>
            </header>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-7">
              <CategoryTag category={entry.category} />

              <h2 className="mt-5 font-display font-extrabold text-ink text-[44px] md:text-[52px] leading-[0.95] tracking-tight normal-case">
                {entry.word}
              </h2>

              <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-zh font-medium text-green-deep text-[28px] leading-tight">
                  {entry.chineseTranslation}
                </span>
                {entry.pinyin && (
                  <span className="font-sans italic text-sage text-lg leading-tight">
                    {entry.pinyin}
                  </span>
                )}
              </div>

              {entry.pronunciation && (
                <section className="mt-5 border-l-4 border-coral pl-4 py-1.5 bg-paper">
                  <div className="label-mono text-coral mb-1.5">
                    Say it · English guide
                  </div>
                  <p className="text-ink text-[15px] leading-[1.6] max-w-[60ch]">
                    {entry.pronunciation}
                  </p>
                </section>
              )}

              <section className="mt-7">
                <div className="label-mono text-sage mb-2">Definition</div>
                <p className="text-ink text-[16px] leading-[1.65] max-w-[60ch]">
                  {entry.description}
                </p>
              </section>

              {entry.example && (
                <section className="mt-7">
                  <div className="label-mono text-sage mb-2">Example</div>
                  <blockquote className="border-l-4 border-coral pl-4 py-1 space-y-2">
                    <p className="font-zh text-ink text-[17px] leading-[1.7]">
                      {entry.example}
                    </p>
                    {entry.exampleEnglish && (
                      <p className="text-ink/75 text-[14px] md:text-[15px] leading-[1.6] italic">
                        {entry.exampleEnglish}
                      </p>
                    )}
                  </blockquote>
                </section>
              )}
            </div>

            {/* Footer actions */}
            <footer className="border-t-2 border-ink bg-paper px-6 py-5 space-y-3">
              <button
                type="button"
                onClick={onToggleLearned}
                className={`w-full border-2 border-ink px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] transition-all ${
                  learned
                    ? "bg-ink text-paper"
                    : "bg-coral text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C]"
                }`}
              >
                {learned ? "✓ Mastered · Unmark" : "Mark as learned"}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onPrev}
                  className="border-2 border-ink px-3 py-3 font-bold uppercase tracking-[0.08em] text-[12px] hover:bg-ink hover:text-paper transition-colors"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="border-2 border-ink px-3 py-3 font-bold uppercase tracking-[0.08em] text-[12px] hover:bg-ink hover:text-paper transition-colors"
                >
                  Next →
                </button>
              </div>
            </footer>
          </div>
        )}
      </aside>
    </>
  );
}
