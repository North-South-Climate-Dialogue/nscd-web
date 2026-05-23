import Link from "next/link";
import QiQi from "./QiQi";

export default function Hero() {
  return (
    <section className="bg-green text-paper border-b-[6px] border-ink relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <h1 className="display text-paper relative leading-[0.88] text-[80px] md:text-[140px] lg:text-[168px]">
              <span
                aria-hidden
                className="absolute inset-0 text-transparent translate-x-[8px] translate-y-[8px] opacity-70"
                style={{
                  WebkitTextStroke: "2px #F96167",
                  color: "transparent",
                }}
              >
                Speak<br />Climate.
              </span>
              <span className="relative">Speak<br />Climate.</span>
            </h1>

            <p className="mt-7 max-w-[40ch] text-[20px] leading-[1.5] text-paper/85">
              A bilingual learning ground for the words that decide our future.
              English ⇄ <span className="font-zh">中文</span>, term by term, together.
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/learning/glossary" className="btn-primary">
                Start Learning →
              </Link>
              <Link href="/quiz" className="btn-ghost">
                Take the Quiz
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <QiQi className="w-[280px] md:w-[340px] h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
