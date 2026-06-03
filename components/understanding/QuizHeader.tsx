export default function QuizHeader() {
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-12 md:py-16">
        <div className="label-mono text-coral mb-3.5">Learn · Test your understanding</div>
        <h1 className="display text-ink text-[48px] md:text-[88px] leading-[0.92] max-w-[18ch] normal-case font-extrabold tracking-tight">
          Test your<br />understanding.
        </h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.55] text-ink/80">
          Multiple-choice rounds drawn from the climate glossary. Each question
          shows you a term — English, Chinese, and pinyin — and asks you to
          pick the definition that matches. Get it right, the word is added to
          your learned list.
        </p>
      </div>
    </section>
  );
}
