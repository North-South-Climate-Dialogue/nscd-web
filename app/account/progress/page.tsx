import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import IdentityCard from "@/components/account/IdentityCard";
import ProgressDashboard from "@/components/account/ProgressDashboard";
import { getAllVocab } from "@/lib/vocabulary";

export const metadata = {
  title: "Progress · NSCD",
};

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
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
            <span className="text-sage">Progress</span>
          </div>
          <h1 className="font-display font-extrabold text-ink text-[48px] md:text-[88px] leading-[0.95] tracking-tight normal-case max-w-[16ch]">
            Words you&apos;ve mastered.
          </h1>
          <p className="mt-5 max-w-[58ch] text-[17px] md:text-[19px] leading-[1.55] text-ink/80">
            A live map of all 149 climate terms, your strongest categories,
            and the most recent words you marked as learned.
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-12 md:gap-16 lg:gap-20 items-start">
          <IdentityCard displayName={displayName} email={email} />
          <ProgressDashboard entries={getAllVocab()} />
        </div>
      </section>
    </>
  );
}
