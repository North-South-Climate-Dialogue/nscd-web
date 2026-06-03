export default function QuizHeader() {
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-12 md:py-16">
        <div className="label-mono text-coral mb-3.5">Quiz</div>
        <h1 className="display text-ink text-[48px] md:text-[88px] leading-[0.92] max-w-[18ch] normal-case font-extrabold tracking-tight">
          Twenty questions.<br />Three ways to play.
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.55] text-ink/80">
          A fresh 20-question round drawn from the climate glossary, mixed at
          random — fill in a blanked Chinese sentence, match a Chinese term to
          its English meaning, or complete a Chinese phrase one character at a
          time. Answer correctly and the word joins your learned list.
        </p>
      </div>
    </section>
  );
}
