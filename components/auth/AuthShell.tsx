import Link from "next/link";

/**
 * Shared layout for /signup and /login — header strip + bordered card slot.
 */
export default function AuthShell({
  eyebrow,
  title,
  intro,
  altLink,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  altLink: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="bg-paper border-b-2 border-ink">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-14 md:py-20">
          <div className="label-mono text-coral mb-3.5">{eyebrow}</div>
          <h1 className="font-display font-extrabold text-ink text-[56px] md:text-[112px] leading-[0.92] tracking-tight normal-case max-w-[14ch]">
            {title}
          </h1>
          <p className="mt-6 max-w-[58ch] text-[17px] md:text-[19px] leading-[1.55] text-ink/80">
            {intro}
          </p>
        </div>
      </section>

      <section className="max-w-[640px] mx-auto px-6 md:px-8 py-14 md:py-16">
        {children}

        <p className="mt-8 label-mono text-sage text-center normal-case tracking-normal text-[14px]">
          <Link
            href={altLink.href}
            className="text-coral border-b-2 border-coral hover:text-ink hover:border-ink transition-colors"
          >
            {altLink.label}
          </Link>
        </p>
      </section>
    </>
  );
}
