import Link from "next/link";
import { getVocabCount } from "@/lib/vocabulary";
import ProgressCard from "./ProgressCard";

/**
 * Civic-Poster-style header strip for the glossary page.
 * Static parts stay server-rendered; the progress card is a client child that
 * reads localStorage on mount.
 */
export default function GlossaryHeader() {
  const total = getVocabCount();

  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-16 md:py-20 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10 items-end">
        <div>
          <div className="label-mono text-coral mb-3.5">Learning · Glossary</div>
          <h1 className="display text-ink text-[56px] md:text-[92px] leading-[0.92] max-w-[16ch]">
            {total} climate terms.<br />Two languages.<br />Yours to learn.
          </h1>

          <Link
            href="/learning/pinyin-guide"
            className="mt-7 inline-flex items-center gap-3 border-2 border-ink bg-paper px-5 py-3 font-extrabold uppercase tracking-[0.08em] text-[13px] shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-coral hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
          >
            <span aria-hidden className="font-zh text-coral text-base">拼</span>
            New to pinyin? Read the simple guide →
          </Link>
        </div>

        <ProgressCard total={total} />
      </div>
    </section>
  );
}
