import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import IdentityCard from "@/components/account/IdentityCard";
import MatchingForm from "@/components/account/MatchingForm";
import {
  AVAILABILITY_OPTIONS,
  TOPIC_OPTIONS,
  OPEN_TO_MATCH_OPTIONS,
  EMPTY_MATCHING,
  type Availability,
  type MatchingFields,
  type OpenToMatch,
  type Topic,
} from "@/types/matching";

export const metadata = {
  title: "Matching · NSCD",
};

const AVAILABILITY_SET: ReadonlySet<string> = new Set(
  AVAILABILITY_OPTIONS.map((o) => o.value),
);
const TOPIC_SET: ReadonlySet<string> = new Set(TOPIC_OPTIONS.map((o) => o.value));
const OPEN_SET: ReadonlySet<string> = new Set(OPEN_TO_MATCH_OPTIONS);

export default async function MatchingPage() {
  const user = await getCurrentUser();
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const raw = (metadata.matching ?? {}) as Record<string, unknown>;

  const initial: MatchingFields = {
    ...EMPTY_MATCHING,
    availability: arrayOfEnum(raw.availability, AVAILABILITY_SET) as Availability[],
    neighborhood: typeof raw.neighborhood === "string" ? raw.neighborhood : "",
    topics: arrayOfEnum(raw.topics, TOPIC_SET) as Topic[],
    about: typeof raw.about === "string" ? raw.about : "",
    open_to_match:
      typeof raw.open_to_match === "string" && OPEN_SET.has(raw.open_to_match)
        ? (raw.open_to_match as OpenToMatch)
        : "",
  };

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
            <span className="text-sage">Matching</span>
          </div>
          <h1 className="font-display font-extrabold text-ink text-[48px] md:text-[88px] leading-[0.95] tracking-tight normal-case max-w-[18ch]">
            Pen-pal interest form.
          </h1>
          <p className="mt-5 max-w-[58ch] text-[17px] md:text-[19px] leading-[1.55] text-ink/80">
            Tell workshop organizers how you&apos;d like to be paired at the
            next in-person session. Everything here is optional except your
            answer to &quot;open to matching?&quot; — that one tells us
            whether to include you in the round.
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-12 md:gap-16 lg:gap-20 items-start">
          <IdentityCard displayName={displayName} email={email} />
          <MatchingForm initial={initial} />
        </div>
      </section>
    </>
  );
}

function arrayOfEnum(v: unknown, allowed: ReadonlySet<string>): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && allowed.has(x));
}
