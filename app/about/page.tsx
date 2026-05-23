import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Who we are · NSCD",
  description:
    "North South Climate Dialogue is a language exchange platform for youth climate action — fostering grassroots collaboration between China and Canada through cross-cultural climate education.",
};

interface Pillar {
  label: string;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    label: "Our mission",
    title: "A language exchange platform for youth climate action.",
    body: "NSCD aims to foster grassroots collaboration between China and Canada through cross-cultural climate education. Climate language is shaped by who's in the room — we want more rooms, more voices, and more shared vocabulary between English and Mandarin speakers working on the same future.",
  },
  {
    label: "Our values",
    title: "Multiculturalism, connection, equity, and respect.",
    body: "These four guide everything we do. We believe in the power of dialogue in the climate sector — that the slow work of explaining a term across languages is itself climate work. Translation is collaboration. Curiosity is qualification.",
  },
  {
    label: "Our goals",
    title: "A pen-pal system for cross-cultural climate education.",
    body: "We're building a way to connect youth from different backgrounds — to learn together, to translate together, and ultimately to take action together. The 149 terms in our glossary are a starting point. The community that grows around them is the real point.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header strip */}
      <section className="bg-paper border-b-2 border-ink">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="label-mono text-coral mb-3.5">About · Who we are</div>
          <h1 className="font-display font-extrabold text-ink text-[64px] md:text-[136px] leading-[0.9] tracking-tight normal-case max-w-[14ch]">
            Who we are.
          </h1>
          <p className="mt-7 max-w-[60ch] text-[18px] md:text-[20px] leading-[1.55] text-ink/80">
            North South Climate Dialogue is a small team building a bigger
            conversation — one bilingual term, one workshop, one pen-pal at a
            time.
          </p>
        </div>
      </section>

      {/* Hero image */}
      <section className="bg-paper">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 pt-10 md:pt-14">
          <div className="border-2 border-ink shadow-thunk-lg overflow-hidden">
            <Image
              src="/about/team.jpg"
              alt="NSCD team and participants at a Vancouver workshop, gathered around a table with bilingual climate term cards."
              width={2400}
              height={1600}
              priority
              className="block w-full h-auto"
            />
          </div>
          <p className="mt-3 label-mono text-sage normal-case tracking-normal text-[12px] italic">
            NSCD at a Vancouver community showcase, May 2025.
          </p>
        </div>
      </section>

      {/* Mission / Values / Goals — two-column intro + stacked cards */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-12 md:gap-16 lg:gap-20 items-start">
          {/* Left — intro */}
          <div className="md:sticky md:top-8 self-start">
            <div className="label-mono text-coral mb-3.5">
              Mission · Values · Goals
            </div>
            <h2
              className="font-display font-extrabold text-ink text-[40px] md:text-[64px] leading-[1] tracking-tight normal-case max-w-[14ch]"
              style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
            >
              Why we exist.
            </h2>
            <p
              className="mt-6 text-ink/85 text-[17px] md:text-[18px] leading-[1.65] max-w-[44ch]"
              style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
            >
              North South Climate Dialogue (NSCD) is a youth-led bilingual climate learning platform that uses 	      language exchange, interactive workshops, and playful translation activities to make climate 			      conversations more accessible. We bridge English and Chinese climate knowledge by helping 		      participants explore key terms, cultural contexts, and real-world climate stories together.
            </p>
          </div>

          {/* Right — stacked cards */}
          <div className="space-y-6 md:space-y-8">
            {PILLARS.map((p) => (
              <article
                key={p.label}
                className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0"
              >
                <div className="label-mono text-coral mb-3">{p.label}</div>
                <h3
                  className="font-display font-extrabold text-ink text-[26px] md:text-[34px] leading-[1.1] tracking-tight normal-case max-w-[24ch]"
                  style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-4 text-ink/85 text-[16px] md:text-[17px] leading-[1.65] max-w-[64ch]"
                  style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                >
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTAs */}
      <section className="border-t-2 border-ink bg-paper">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <h2 className="font-display font-extrabold text-ink text-[36px] md:text-[56px] leading-[1] tracking-tight normal-case max-w-[20ch]">
            Want to join the dialogue?
          </h2>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.55] text-ink/80">
            You can start with the vocabulary, read a workshop recap, or reach
            out about joining the pen-pal system.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[760px]">
            <Link
              href="/learning/glossary"
              className="border-2 border-ink bg-coral px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all text-center"
            >
              Open the glossary →
            </Link>
            <Link
              href="/blog"
              className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink hover:bg-ink hover:text-paper transition-colors text-center"
            >
              Read our blog
            </Link>
            <Link
              href="/contact"
              className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink hover:bg-ink hover:text-paper transition-colors text-center"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
