import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24 border-t-[6px] border-ink">
      <div className="max-w-[1200px] mx-auto px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10">
          <div>
            <Image
              src="/logo/NSCD_Logo_DarkBlue.png"
              alt="NSCD"
              width={360}
              height={150}
              className="h-24 md:h-32 w-auto -ml-4"
            />
            <p className="mt-4 text-sm text-paper/70 max-w-[36ch]">
              A bilingual climate learning and language exchange platform. Made in Vancouver.
            </p>
          </div>
          <FooterCol heading="Learn" items={[
            { href: "/learning/glossary",     label: "Glossary" },
            { href: "/learning/pinyin-guide", label: "Simple Pinyin Guide" },
            { href: "/learning/flashcards",   label: "Flashcards" },
          ]} />
          <FooterCol heading="Quiz" items={[
            { href: "/quiz", label: "Take the quiz" },
          ]} />
          <FooterCol heading="Our work" items={[
            { href: "/blog",   label: "Blog" },
            { href: "/events", label: "Events" },
          ]} />
          <FooterCol heading="About" items={[
            { href: "/about",   label: "Who we are" },
            { href: "/contact", label: "Contact / Join" },
          ]} />
        </div>

        <div className="mt-12 pt-8 border-t border-paper/15">
          <h4 className="label-mono text-coral mb-3">Land acknowledgement</h4>
          <p className="text-paper/85 text-sm leading-[1.7] max-w-[120ch]">
            NSCD operates on the unceded, shared territory of the
            xʷməθkʷəy̓əm (Musqueam), Sḵwx̱wú7mesh (Squamish), and
            səlilwətaɬ (Tsleil-Waututh) Nations, also known as Vancouver. We
            acknowledge and honor the Indigenous peoples who have been stewards
            of this land since time immemorial.
          </p>
        </div>

        <div className="mt-10 pt-5 border-t border-paper/15 flex flex-wrap justify-between gap-3 label-mono text-paper/60">
          <span>NSCD · Vancouver · 2026</span>
          <span>Civic Poster Edition</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  items,
}: {
  heading: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="label-mono text-paper/60 mb-3">{heading}</h4>
      <ul className="space-y-1.5 text-sm">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="text-paper hover:text-coral transition-colors">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
