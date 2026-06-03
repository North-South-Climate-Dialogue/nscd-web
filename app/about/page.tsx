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

interface Founder {
  name: string;
  nameZh: string;
  pronouns: string;
  image: string;
  bio: string;
}

const FOUNDERS: Founder[] = [
  {
    name: "Hailin Wang",
    nameZh: "王海琳",
    pronouns: "she/her",
    image: "/about/hailin.jpg",
    bio: "An aspiring actuary and climate advocate with a background in actuarial science, Hailin is interested in how risk modelling, climate adaptation, and disaster finance can support communities on the front lines of climate change. She brings analytical thinking and a strong equity lens to NSCD — because translation is about context, belonging, and who gets to participate in climate conversations.",
  },
  {
    name: "Junhua Qu",
    nameZh: "曲君华",
    pronouns: "she/her",
    image: "/about/junhua.jpg",
    bio: "An energy modeler with a background in energy management, environmental engineering, climate policy, and building decarbonization, Junhua has worked on energy transition, carbon markets, greenhouse-gas accounting, and community-based climate education across China and Canada. As an immigrant and bilingual climate learner herself, she started NSCD to make climate knowledge more accessible across languages and cultures.",
  },
];

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

      {/* Meet QiQi — tangram mascot */}
      <section className="bg-[#FAF6EC] border-b-2 border-ink">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left — QiQi image */}
            <div className="order-1">
              <div className="relative aspect-square border-2 border-ink shadow-thunk-lg bg-paper overflow-hidden">
                <Image
                  src="/images/mascot/qiqi.png"
                  alt="QiQi, the NSCD mascot, built from the seven geometric pieces of a Chinese tangram."
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-8 md:p-12"
                />
              </div>
            </div>

            {/* Right — introduction */}
            <div className="order-2 min-w-0">
              <div className="label-mono text-coral mb-3.5">
                七巧板 · Tangram · Rebuilding climate language
              </div>
              <h2 className="font-display font-extrabold text-ink text-[36px] md:text-[56px] leading-[1.02] tracking-tight normal-case max-w-[18ch]">
                Meet QiQi, our tangram mascot.
              </h2>
              <p className="mt-6 text-ink/85 text-[17px] md:text-[18px] leading-[1.65] max-w-[58ch]">
                QiQi is inspired by 七巧板, the traditional Chinese tangram
                puzzle made from seven simple shapes. Just like a tangram can be
                taken apart and rebuilt into endless forms, NSCD believes
                language can be deconstructed, translated, and reimagined across
                cultures. QiQi represents curiosity, playfulness, and inclusion —
                reminding us that climate dialogue is not one fixed shape, but
                something we build together through many voices, perspectives,
                and ways of learning.
              </p>

              {/* Visual tagline */}
              <blockquote className="mt-8 border-l-4 border-coral pl-5">
                <p className="font-display font-extrabold text-ink text-[24px] md:text-[32px] leading-[1.1] tracking-tight normal-case">
                  “Deconstruct. Translate. Rebuild.”
                </p>
              </blockquote>
            </div>
          </div>
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

      {/* Meet the Co-founders */}
      <section className="border-t-2 border-ink bg-paper">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-24">
          <div className="label-mono text-coral mb-3.5">The people · 创始人</div>
          <h2 className="font-display font-extrabold text-ink text-[40px] md:text-[64px] leading-[1] tracking-tight normal-case max-w-[16ch]">
            Meet the co-founders.
          </h2>
          <p className="mt-6 max-w-[58ch] text-ink/80 text-[17px] md:text-[18px] leading-[1.6]">
            Two bilingual climate learners building the kind of room they wanted
            to be in — where a term can be explained, questioned, and shared
            across languages.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {FOUNDERS.map((f) => (
              <article
                key={f.name}
                className="border-2 border-ink bg-paper shadow-thunk-lg overflow-hidden flex flex-col min-w-0"
              >
                <div className="relative aspect-square border-b-2 border-ink bg-sage/10">
                  <Image
                    src={f.image}
                    alt={`Portrait of ${f.name}, co-founder of NSCD.`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="p-7 md:p-9">
                  <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                    <h3 className="font-display font-extrabold text-ink text-[28px] md:text-[34px] leading-[1.05] tracking-tight normal-case">
                      {f.name}
                    </h3>
                    <span className="font-zh font-bold text-green-deep text-[22px] md:text-[26px] leading-none">
                      {f.nameZh}
                    </span>
                  </div>
                  <div className="label-mono text-coral mt-2.5">
                    Co-founder · {f.pronouns}
                  </div>
                  <p
                    className="mt-4 text-ink/85 text-[16px] md:text-[17px] leading-[1.65]"
                    style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                  >
                    {f.bio}
                  </p>
                </div>
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
