const steps = [
  { word: "LEARN", caption: "149 bilingual climate terms" },
  { word: "PRACTICE", caption: "Flashcards · Quiz · Real sentences" },
  { word: "MATCH", caption: "In-person language exchange in Vancouver" },
];

export default function StatsBand() {
  return (
    <section className="bg-coral text-ink border-b-[6px] border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-9 flex flex-wrap justify-between gap-6">
        {steps.map((s) => (
          <div
            key={s.word}
            className="display text-[40px] leading-none tracking-[-0.01em]"
          >
            {s.word}
            <span className="block font-sans text-[13px] font-medium uppercase tracking-[0.12em] mt-2 normal-case">
              {s.caption}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
