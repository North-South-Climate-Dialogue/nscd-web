import { getPlatformStats } from "@/lib/supabase/stats";

// Shown when Supabase isn't configured or the stats call fails — the page
// must never crash, so this is always a safe fallback.
const STATIC_STEPS = [
  { word: "LEARN", caption: "149 bilingual climate terms" },
  { word: "PRACTICE", caption: "Flashcards · Quiz · Real sentences" },
  { word: "DIALOGUE", caption: "In-person language exchange in Vancouver" },
];

export default async function StatsBand() {
  const stats = await getPlatformStats();

  const steps = stats
    ? [
        { word: stats.registeredUsers.toLocaleString(), caption: "Climate learners" },
        { word: stats.vocabCompletions.toLocaleString(), caption: "Words completed" },
        { word: `${stats.uniqueTermsLearned} / 149`, caption: "Terms discovered" },
      ]
    : STATIC_STEPS;

  return (
    <section className="bg-coral text-ink border-b-[6px] border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-9 flex flex-wrap justify-between gap-6">
        {steps.map((s) => (
          <div
            key={s.caption}
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
