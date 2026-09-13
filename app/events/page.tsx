import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Events · NSCD",
  description:
    "Upcoming NSCD events and workshops. Next up: Climate Multilingual Media Game for Inclusive Action — an interactive workshop on climate language and media framing at Vancouver Climate Day 2026, Friday September 18, 2026.",
};

const REGISTER_URL = "https://www.sfu.ca/dialogue/vcd26";

const DETAILS = [
  { label: "Date", value: "Friday, September 18, 2026" },
  { label: "Time", value: "10:30 – 11:30 AM" },
  {
    label: "Location",
    value: "Room 420, SFU Morris J. Wosk Centre for Dialogue\n580 W Hastings St",
  },
  { label: "Cost", value: "$100 · General admission" },
];

export default function EventsPage() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-24">
      {/* Page header */}
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 md:gap-10 items-center">
        <div className="order-2 md:order-1">
          <div className="label-mono text-coral mb-3.5">Our work · Events</div>
          <h1 className="font-display font-extrabold text-ink text-[52px] md:text-[104px] leading-[0.92] tracking-tight normal-case max-w-[16ch]">
            Wanna see me IRL?
          </h1>
          <p className="mt-6 max-w-[58ch] text-[18px] md:text-[20px] leading-[1.55] text-ink/80">
            In-person bilingual climate workshops and language-exchange meetups.
            Here&apos;s what&apos;s next.
          </p>
        </div>
        <div className="order-1 md:order-2 justify-self-center md:justify-self-end">
          <Image
            src="/events/qiqi-cheers.png"
            alt="QiQi, the NSCD tangram mascot, cheering with confetti"
            width={620}
            height={620}
            priority
            className="w-[200px] md:w-[300px] h-auto"
          />
        </div>
      </div>

      {/* Featured event */}
      <article className="mt-12 md:mt-16 border-2 border-ink bg-paper shadow-thunk-lg">
        {/* Banner */}
        <div className="border-b-2 border-ink bg-coral px-6 md:px-10 py-6 md:py-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 label-mono text-ink">
              <span className="block w-2.5 h-2.5 rounded-full bg-ink animate-pulse" aria-hidden />
              Next event · Registration open
            </span>
          </div>
          <h2 className="mt-3 font-display font-extrabold text-ink text-[32px] md:text-[52px] leading-[1.05] tracking-tight normal-case">
            Climate Multilingual Media Game for Inclusive Action
          </h2>
          <p className="mt-2 label-mono text-ink/80 normal-case tracking-normal text-[13px] md:text-[14px]">
            Presented as part of Vancouver Climate Day 2026 — climate language,
            media framing, and public perception, live.
          </p>
        </div>

        {/* Body: description + registration */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
          {/* Left — description + details */}
          <div className="p-6 md:p-10 lg:border-r-2 lg:border-ink min-w-0">
            <div className="mb-8 border-2 border-ink shadow-thunk max-w-[480px] mx-auto">
              <Image
                src="/events/vcd26-promo.jpg"
                alt="Vancouver Climate Day 2026 promo graphic: 'Do the languages we speak shape who participates in local action?' Sept 18, 580 W Hastings."
                width={876}
                height={878}
                className="block w-full h-auto"
              />
            </div>
            <div className="space-y-4 text-ink/85 text-[16px] md:text-[17px] leading-[1.65]">
              <p>
                How much can a few words change the way we understand climate
                change? At Vancouver Climate Day 2026, North South Climate
                Dialogue (NSCD) will host an interactive workshop exploring the
                relationship between climate language, media framing, and
                public perception.
              </p>
              <p>
                Participants will investigate real climate headlines, vote on
                how different stories make them feel, and work in teams to
                transform the same set of climate facts into headlines for
                different audiences and media contexts.
              </p>
              <p>
                Rather than simply asking whether a story is &ldquo;true&rdquo;
                or &ldquo;false,&rdquo; the workshop invites participants to
                look more closely at what gets emphasized, what gets left out,
                and how tone and word choice influence the climate story we
                receive.
              </p>
              <p>Expect games, discussion, collaboration, and plenty of surprising headlines.</p>
            </div>

            {/* Details grid */}
            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 border-t-2 border-ink/15 pt-7">
              {DETAILS.map((d) => (
                <div key={d.label} className="min-w-0">
                  <dt className="label-mono text-coral mb-1.5">{d.label}</dt>
                  <dd className="font-display font-extrabold text-ink text-[18px] md:text-[20px] leading-tight normal-case whitespace-pre-line">
                    {d.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-ink/70 text-[14px] leading-[1.6] max-w-[60ch]">
              Hosted by North South Climate Dialogue, a youth-led climate-tech
              initiative that breaks language and cultural barriers in climate
              action.{" "}
              <Link
                href="/quiz"
                className="text-coral border-b-2 border-coral hover:text-ink hover:border-ink transition-colors"
              >
                Try the webgame first →
              </Link>
            </p>
          </div>

          {/* Right — registration QR */}
          <div className="p-6 md:p-10 bg-[#FAF6EC] flex flex-col items-center text-center">
            <div className="label-mono text-coral mb-4">Register</div>

            <div className="border-2 border-ink bg-paper p-4 shadow-thunk">
              <Image
                src="/events/sfu-qr.png"
                alt="QR code to register for Vancouver Climate Day 2026 on the SFU Morris J. Wosk Centre for Dialogue website"
                width={220}
                height={220}
                className="block w-[200px] h-[200px] md:w-[220px] md:h-[220px]"
              />
            </div>

            <p className="mt-5 text-ink/80 text-[15px] leading-[1.55] max-w-[28ch]">
              Scan the code to register for Vancouver Climate Day 2026.
            </p>

            <Link
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block w-full bg-ink text-paper px-5 py-3.5 font-extrabold uppercase tracking-[0.1em] text-[14px] text-center hover:bg-green transition-colors"
            >
              Register on SFU Dialogue →
            </Link>
            <span className="mt-2.5 label-mono text-sage normal-case tracking-normal text-[12px] break-all">
              sfu.ca/dialogue/vcd26
            </span>
          </div>
        </div>
      </article>

      {/* Secondary actions */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[640px]">
        <Link
          href="/contact"
          className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink hover:bg-ink hover:text-paper transition-colors text-center"
        >
          Get notified about future events →
        </Link>
        <Link
          href="/blog"
          className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink hover:bg-ink hover:text-paper transition-colors text-center"
        >
          Read past recaps
        </Link>
      </div>
    </section>
  );
}
