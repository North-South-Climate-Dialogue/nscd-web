import Link from "next/link";

export const metadata = {
  title: "Events · NSCD",
  description:
    "Upcoming NSCD events, workshops, and in-person language-exchange meetups. Stay tuned for announcements.",
};

export default function EventsPage() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-20 md:py-28 min-h-[60vh]">
      <div className="label-mono text-coral mb-3.5">Our work · Events</div>

      <h1 className="font-display font-extrabold text-ink text-[64px] md:text-[136px] leading-[0.92] tracking-tight normal-case max-w-[18ch]">
        Stay tuned.
      </h1>

      <p className="mt-7 max-w-[58ch] text-[18px] md:text-[20px] leading-[1.55] text-ink/80">
        We&apos;re planning the next round of bilingual climate workshops,
        language-exchange meetups, and community showcases. Dates, locations,
        and RSVP links will land here as soon as they&apos;re confirmed.
      </p>

      <div className="mt-12 inline-flex items-center gap-3 border-2 border-ink bg-paper px-5 py-3 shadow-thunk">
        <span className="block w-2.5 h-2.5 rounded-full bg-coral animate-pulse" aria-hidden />
        <span className="label-mono text-ink">Status · Programming the next event</span>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[640px]">
        <Link
          href="/contact"
          className="border-2 border-ink bg-coral px-5 py-4 font-extrabold uppercase tracking-[0.1em] text-[14px] text-ink shadow-thunk hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#0E1F2C] transition-all text-center"
        >
          Get notified →
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
