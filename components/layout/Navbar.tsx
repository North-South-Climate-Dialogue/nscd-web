import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth/server";
import { signOutAction } from "@/app/account/actions";

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

const NAV: NavItem[] = [
  {
    href: "/learning/glossary",
    label: "Learn",
    children: [
      { href: "/learning/glossary",     label: "Glossary" },
      { href: "/learning/pinyin-guide", label: "Simple Pinyin Guide" },
      { href: "/learning/flashcards",   label: "Flashcards" },
      { href: "/learning/quiz",         label: "Test your understanding" },
    ],
  },
  { href: "/quiz", label: "Quiz" },
  {
    href: "/blog",
    label: "Our Work",
    children: [
      { href: "/blog",   label: "Blog" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about",   label: "Who we are" },
      { href: "/contact", label: "Contact / Join" },
    ],
  },
];

export default async function Navbar() {
  const user = await getCurrentUser();
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    null;

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b-2 border-ink bg-paper relative z-20">
      <Link href="/" className="flex items-center" aria-label="NSCD Home">
        <Image
          src="/logo/NSCD_Logo_Transparent.png"
          alt="North South Climate Dialogue"
          width={420}
          height={175}
          priority
          className="h-24 md:h-32 w-auto"
        />
      </Link>

      <div className="flex items-center gap-8 ml-auto">
        <ul className="hidden md:flex gap-8 text-[13px] font-semibold uppercase tracking-[0.08em]">
          {NAV.map((item) => (
            <NavItemView key={item.label} item={item} />
          ))}
        </ul>

        {user && displayName ? (
          <AccountMenu displayName={displayName} />
        ) : (
          <Link
            href="/login"
            className="bg-ink text-paper text-[13px] font-semibold uppercase tracking-[0.08em] px-4 py-2.5 hover:bg-green transition-colors whitespace-nowrap"
          >
            Sign up / Log in
          </Link>
        )}
      </div>
    </nav>
  );
}

function NavItemView({ item }: { item: NavItem }) {
  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          className="text-ink hover:border-b-2 hover:border-coral pb-[2px] transition-[border]"
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li className="group relative">
      <Link
        href={item.href}
        className="inline-flex items-center gap-1.5 text-ink pb-[2px] border-b-2 border-transparent group-hover:border-coral focus:border-coral transition-[border]"
        aria-haspopup="true"
      >
        {item.label}
        <span aria-hidden className="text-[10px] translate-y-px text-ink/60 group-hover:text-coral transition-colors">▾</span>
      </Link>

      <div
        aria-hidden
        className="absolute left-0 right-0 h-3 top-full pointer-events-none group-hover:pointer-events-auto"
      />

      <div
        role="menu"
        aria-label={`${item.label} submenu`}
        className="absolute left-0 top-[calc(100%+12px)] min-w-[220px] border-2 border-ink bg-paper shadow-thunk-lg
                   opacity-0 invisible -translate-y-1
                   group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                   group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0
                   transition-[opacity,transform] duration-150"
      >
        <ul className="py-1.5">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                role="menuitem"
                className="block px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink hover:bg-coral hover:text-ink focus:bg-coral focus:text-ink focus:outline-none transition-colors"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function AccountMenu({ displayName }: { displayName: string }) {
  const short =
    displayName.length > 16 ? displayName.slice(0, 14) + "…" : displayName;
  return (
    <div className="group relative">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 bg-ink text-paper text-[13px] font-semibold uppercase tracking-[0.08em] px-4 py-2.5 hover:bg-green transition-colors whitespace-nowrap"
        aria-haspopup="true"
      >
        Hi, {short}
        <span aria-hidden className="text-[10px]">▾</span>
      </Link>

      <div
        aria-hidden
        className="absolute left-0 right-0 h-3 top-full pointer-events-none group-hover:pointer-events-auto"
      />

      <div
        role="menu"
        aria-label="Account menu"
        className="absolute right-0 top-[calc(100%+12px)] min-w-[220px] border-2 border-ink bg-paper shadow-thunk-lg
                   opacity-0 invisible -translate-y-1
                   group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                   group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0
                   transition-[opacity,transform] duration-150"
      >
        <ul className="py-1.5">
          {[
            { href: "/account",          label: "Dashboard" },
            { href: "/account/profile",  label: "Profile" },
            { href: "/account/progress", label: "Progress" },
            { href: "/account/goals",    label: "Goals" },
            { href: "/account/matching", label: "Matching" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                role="menuitem"
                className="block px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink hover:bg-coral hover:text-ink focus:bg-coral focus:text-ink focus:outline-none transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="border-t-2 border-ink mt-1.5 pt-1.5">
            <form action={signOutAction}>
              <button
                type="submit"
                role="menuitem"
                className="block w-full text-left px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-coral hover:bg-coral hover:text-ink focus:bg-coral focus:text-ink focus:outline-none transition-colors"
              >
                Log out
              </button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}
