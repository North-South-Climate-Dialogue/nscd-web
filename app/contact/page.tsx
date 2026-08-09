import Link from "next/link";
import CopyEmailButton from "@/components/contact/CopyEmailButton";

const EMAIL = "asknscd@gmail.com";

export const metadata = {
  title: "Contact / Join · NSCD",
  description:
    "Get in touch with North South Climate Dialogue. Email us about workshops, partnerships, joining the pen-pal system, or anything else.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-paper border-b-2 border-ink">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="label-mono text-coral mb-3.5">About · Contact / Join</div>
          <h1 className="font-display font-extrabold text-ink text-[64px] md:text-[136px] leading-[0.9] tracking-tight normal-case max-w-[14ch]">
            Say hello.
          </h1>
          <p className="mt-7 max-w-[60ch] text-[18px] md:text-[20px] leading-[1.55] text-ink/80">
            Reach out about workshops, partnerships, climate translation,
            joining the pen-pal system, or anything else on your mind. We
            read every email.
          </p>
        </div>
      </section>

      {/* Email card */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-12 md:gap-16 lg:gap-20 items-start">
          {/* Left intro */}
          <div className="md:sticky md:top-8 self-start">
            <div className="label-mono text-coral mb-3.5">Email</div>
            <h2
              className="font-display font-extrabold text-ink text-[40px] md:text-[64px] leading-[1] tracking-tight normal-case max-w-[14ch]"
              style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
            >
              The best way to find us.
            </h2>
            <p className="mt-6 text-ink/85 text-[17px] md:text-[18px] leading-[1.65] max-w-[44ch]">
              We&apos;ll get back to you within a few days. Write in English or
              中文 — whichever feels easier.
            </p>
          </div>

          {/* Email card */}
          <article className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-10 min-w-0">
            <div className="label-mono text-sage mb-3">Write to us</div>
            <a
              href={`mailto:${EMAIL}`}
              className="block font-display font-extrabold text-ink text-[28px] sm:text-[40px] md:text-[50px] leading-[1.05] tracking-tight normal-case break-all hover:text-coral transition-colors"
              style={{ overflowWrap: "anywhere", wordBreak: "break-all" }}
            >
              {EMAIL}
            </a>

            <p className="mt-5 text-ink/75 text-[15px] leading-[1.6] max-w-[58ch]">
              Tap the address to open it in your email app, or copy it to
              compose somewhere else.
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="border-2 border-ink bg-coral px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all text-center"
              >
                Open in mail app →
              </a>
              <CopyEmailButton email={EMAIL} />
            </div>
          </article>
        </div>
      </section>

      {/* Social — placeholders */}
      <section className="border-t-2 border-ink bg-paper">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-12 md:gap-16 lg:gap-20 items-start">
            <div>
              <div className="label-mono text-coral mb-3.5">Social</div>
              <h2 className="font-display font-extrabold text-ink text-[40px] md:text-[64px] leading-[1] tracking-tight normal-case max-w-[14ch]">
                Find us elsewhere.
              </h2>
              <p className="mt-6 text-ink/85 text-[17px] md:text-[18px] leading-[1.65] max-w-[44ch]">
                We&apos;re on Instagram — workshop recaps, bilingual climate
                term cards, and pen-pal calls. More channels are on the way.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              <SocialLink
                name="Instagram"
                handle="@nsclimatedialogue"
                href="https://www.instagram.com/nsclimatedialogue/"
              />
              <SocialPlaceholder name="More to come" handle="LinkedIn · WeChat · 小红书" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTAs */}
      <section className="border-t-2 border-ink bg-paper">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <h2 className="font-display font-extrabold text-ink text-[36px] md:text-[56px] leading-[1] tracking-tight normal-case max-w-[20ch]">
            While you&apos;re here.
          </h2>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.55] text-ink/80">
            A few places worth visiting before you close the tab.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[760px]">
            <Link
              href="/about"
              className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink hover:bg-ink hover:text-paper transition-colors text-center"
            >
              Who we are
            </Link>
            <Link
              href="/blog"
              className="border-2 border-ink bg-paper px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink hover:bg-ink hover:text-paper transition-colors text-center"
            >
              Read the blog
            </Link>
            <Link
              href="/learning/glossary"
              className="border-2 border-ink bg-coral px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all text-center"
            >
              Open the glossary →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SocialLink({
  name,
  handle,
  href,
}: {
  name: string;
  handle: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-2 border-ink bg-paper p-5 md:p-6 shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display font-extrabold text-ink text-[22px] md:text-[26px] leading-none tracking-tight normal-case">
          {name}
        </span>
        <span className="label-mono text-coral whitespace-nowrap group-hover:text-ink transition-colors">
          Follow →
        </span>
      </div>
      <div className="mt-2 label-mono text-ink normal-case tracking-normal text-[14px] md:text-[15px]">
        {handle}
      </div>
    </a>
  );
}

function SocialPlaceholder({ name, handle }: { name: string; handle: string }) {
  return (
    <div className="border-2 border-dashed border-ink/40 bg-paper p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display font-extrabold text-ink text-[22px] md:text-[26px] leading-none tracking-tight normal-case">
          {name}
        </span>
        <span className="label-mono text-coral whitespace-nowrap">Coming soon</span>
      </div>
      <div className="mt-2 label-mono text-sage normal-case tracking-normal text-[13px] italic">
        {handle}
      </div>
    </div>
  );
}
