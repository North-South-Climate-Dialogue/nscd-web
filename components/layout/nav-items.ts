/**
 * Shared navigation data for the desktop Navbar (server component) and the
 * mobile drawer (client component), so both stay in sync from one source.
 */

export interface NavChild {
  href: string;
  label: string;
}

export interface NavItem {
  href: string;
  label: string;
  children?: NavChild[];
}

export const NAV: NavItem[] = [
  {
    href: "/learning/glossary",
    label: "Learn",
    children: [
      { href: "/learning/glossary", label: "Glossary" },
      { href: "/learning/pinyin-guide", label: "Simple Pinyin Guide" },
      { href: "/learning/flashcards", label: "Flashcards" },
      { href: "/learning/quiz", label: "Test your understanding" },
    ],
  },
  { href: "/quiz", label: "Quiz" },
  {
    href: "/blog",
    label: "Our Work",
    children: [
      { href: "/blog", label: "Blog" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "Who we are" },
      { href: "/contact", label: "Contact / Join" },
    ],
  },
];

export const ACCOUNT_LINKS: NavChild[] = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/progress", label: "Progress" },
  { href: "/account/goals", label: "Goals" },
  { href: "/account/matching", label: "Matching" },
];
