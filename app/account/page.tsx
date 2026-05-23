import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import { signOutAction } from "./actions";

export const metadata = {
  title: "Account · NSCD",
};

export default async function AccountDashboardPage() {
  // Layout already guarded — user is non-null here.
  const user = await getCurrentUser();
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "friend";

  return (
    <>
      {/* Header */}
      <section className="bg-paper border-b-2 border-ink">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-14 md:py-20">
          <div className="label-mono text-coral mb-3.5">Account · Dashboard</div>
          <h1 className="font-display font-extrabold text-ink text-[56px] md:text-[112px] leading-[0.92] tracking-tight normal-case max-w-[16ch]">
            Hi, {displayName}.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[17px] md:text-[19px] leading-[1.55] text-ink/80">
            This is your NSCD home base. Track learned words, set language
            goals, and tell us how you&apos;d like to be matched at the next
            workshop.
          </p>
        </div>
      </section>

      {/* Account info + tiles */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-12 md:gap-16 lg:gap-20 items-start">
          {/* Identity card */}
          <article className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0 md:sticky md:top-8 self-start">
            <div className="label-mono text-sage mb-3">Signed in as</div>
            <div className="font-display font-extrabold text-ink text-[26px] md:text-[32px] leading-tight tracking-tight normal-case break-words">
              {displayName}
            </div>
            <div className="mt-2 font-mono text-ink/70 text-[14px] break-all">
              {user?.email}
            </div>

            <form action={signOutAction} className="mt-7">
              <button
                type="submit"
                className="w-full border-2 border-ink bg-paper px-5 py-3.5 font-extrabold uppercase tracking-[0.1em] text-[13px] text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                Log out
              </button>
            </form>
          </article>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Tile
              eyebrow="Profile"
              title="Edit your profile."
              body="Name, bio, language background — control what other users see."
              href="/account/profile"
            />
            <Tile
              eyebrow="Language goals"
              title="Set a weekly target."
              body="What you're practicing, how much, and your streak."
              href="/account/goals"
            />
            <Tile
              eyebrow="Progress"
              title="Words you've mastered."
              body="A heat-grid of all 149 terms colored by status, plus badges."
              href="/account/progress"
            />
            <Tile
              eyebrow="Matching"
              title="Pen-pal interest form."
              body="Tell workshop organizers how you'd like to be paired."
              href="/account/matching"
              accent
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Tile({
  eyebrow,
  title,
  body,
  href,
  accent,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block border-2 border-ink shadow-thunk-lg p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_#23492A] ${
        accent ? "bg-coral text-ink" : "bg-paper text-ink"
      }`}
    >
      <div className="label-mono text-coral mb-2">{eyebrow}</div>
      <div className="font-display font-extrabold text-[22px] md:text-[26px] leading-tight tracking-tight normal-case">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.55] opacity-85">{body}</p>
      <div className="mt-4 label-mono text-coral">Open →</div>
    </Link>
  );
}
