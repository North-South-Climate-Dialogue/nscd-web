import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import IdentityCard from "@/components/account/IdentityCard";
import GoalsForm, {
  WEEKLY_TARGETS,
  type WeeklyTarget,
} from "@/components/account/GoalsForm";
import { getVocabCount } from "@/lib/vocabulary";

export const metadata = {
  title: "Language goals · NSCD",
};

const DEFAULT_TARGET: WeeklyTarget = 10;

export default async function GoalsPage() {
  const user = await getCurrentUser();
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;

  const target = readTarget(metadata.weekly_target);
  const displayName =
    (typeof metadata.display_name === "string" && metadata.display_name) ||
    user?.email?.split("@")[0] ||
    "friend";
  const email = user?.email ?? "";

  return (
    <>
      <section className="bg-paper border-b-2 border-ink">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="label-mono text-coral mb-3.5">
            <Link href="/account" className="hover:text-ink transition-colors">
              Account
            </Link>
            <span className="mx-2 text-ink/30">·</span>
            <span className="text-sage">Goals</span>
          </div>
          <h1 className="font-display font-extrabold text-ink text-[48px] md:text-[88px] leading-[0.95] tracking-tight normal-case max-w-[16ch]">
            Language goals.
          </h1>
          <p className="mt-5 max-w-[58ch] text-[17px] md:text-[19px] leading-[1.55] text-ink/80">
            Set a weekly target, track this week&apos;s pace, and watch your
            streak. Activity is counted from words you&apos;ve marked as
            learned in the glossary, flashcards, or quiz.
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-12 md:gap-16 lg:gap-20 items-start">
          <IdentityCard displayName={displayName} email={email} />
          <GoalsForm initialTarget={target} totalTerms={getVocabCount()} />
        </div>
      </section>
    </>
  );
}

function readTarget(v: unknown): WeeklyTarget {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return (WEEKLY_TARGETS as readonly number[]).includes(n)
    ? (n as WeeklyTarget)
    : DEFAULT_TARGET;
}
