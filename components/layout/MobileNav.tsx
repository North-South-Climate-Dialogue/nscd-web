"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, ACCOUNT_LINKS } from "./nav-items";
import { signOutAction } from "@/app/account/actions";

/**
 * Mobile navigation — hamburger button + full-width drawer.
 *
 * Visible only below `md:` (the desktop nav handles ≥ md). The drawer mirrors
 * the desktop nav: top-level links with their sub-links stacked beneath, plus
 * the auth CTA / account links. Closes on link tap, outside tap, Escape, and
 * route change.
 */
export default function MobileNav({
  signedIn,
  displayName,
}: {
  signedIn: boolean;
  displayName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 inline-flex items-center justify-center w-11 h-11 border-2 border-ink bg-paper text-ink hover:bg-coral transition-colors"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M5 5l14 14M19 5L5 19" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {/* Transparent backdrop — captures outside taps to close. */}
      {open && (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={close}
          className="fixed inset-0 z-30 cursor-default"
        />
      )}

      {/* Drawer — full width, anchored below the navbar. */}
      <div
        id="mobile-menu"
        className={`absolute left-0 top-full w-full bg-paper border-b-2 border-ink shadow-thunk-lg z-40 ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          aria-label="Mobile"
          className="max-h-[calc(100vh-7rem)] overflow-y-auto"
        >
          <ul className="px-6 divide-y divide-ink/15">
            {NAV.map((item) => (
              <li key={item.label} className="py-3.5">
                <Link
                  href={item.href}
                  onClick={close}
                  className="block text-[15px] font-extrabold uppercase tracking-[0.08em] text-ink hover:text-coral transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mt-2.5 pl-3 border-l-2 border-ink/15 space-y-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={close}
                          className="block text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/75 hover:text-coral transition-colors"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="px-6 py-5 border-t-2 border-ink">
            {signedIn ? (
              <div className="space-y-3">
                <div className="label-mono text-sage normal-case tracking-normal text-[12px]">
                  Signed in{displayName ? ` as ${displayName}` : ""}
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {ACCOUNT_LINKS.map((a) => (
                    <li key={a.href}>
                      <Link
                        href={a.href}
                        onClick={close}
                        className="block border-2 border-ink px-3 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink text-center hover:bg-coral transition-colors"
                      >
                        {a.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="block w-full border-2 border-ink px-4 py-3 text-[13px] font-extrabold uppercase tracking-[0.08em] text-coral hover:bg-coral hover:text-ink transition-colors"
                  >
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={close}
                className="block w-full bg-ink text-paper px-4 py-3.5 text-[14px] font-extrabold uppercase tracking-[0.08em] text-center hover:bg-green transition-colors"
              >
                Sign up / Log in
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
