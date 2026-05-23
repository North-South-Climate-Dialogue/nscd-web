import Link from "next/link";

export default function PageStub({
  eyebrow,
  title,
  description,
  next,
}: {
  eyebrow: string;
  title: string;
  description: string;
  next?: { href: string; label: string };
}) {
  return (
    <section className="max-w-[1200px] mx-auto px-8 py-24 min-h-[60vh]">
      <div className="label-mono text-coral mb-3.5">{eyebrow}</div>
      <h1 className="display text-ink text-[64px] md:text-[120px] leading-[0.9] max-w-[14ch]">
        {title}
      </h1>
      <p className="mt-6 max-w-[52ch] text-lg text-ink/80">{description}</p>

      <div className="mt-10 inline-flex items-center gap-3 border-2 border-ink bg-paper px-5 py-3 shadow-thunk">
        <span className="label-mono text-sage">Status</span>
        <span className="font-semibold uppercase text-[13px] tracking-[0.08em]">
          Page under construction
        </span>
      </div>

      {next && (
        <div className="mt-8">
          <Link href={next.href} className="btn-primary">
            {next.label}
          </Link>
        </div>
      )}
    </section>
  );
}
