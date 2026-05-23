import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import IdentityCard from "@/components/account/IdentityCard";
import ProfileForm from "@/components/account/ProfileForm";
import {
  EMPTY_PROFILE,
  NATIVE_LANGUAGES,
  PRACTICING_LANGUAGES,
  type NativeLanguage,
  type PracticingLanguage,
  type ProfileFields,
} from "@/types/profile";

export const metadata = {
  title: "Profile · NSCD",
};

export default async function ProfilePage() {
  // Layout already guards — user is non-null here.
  const user = await getCurrentUser();
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;

  const initial: ProfileFields = {
    ...EMPTY_PROFILE,
    display_name:
      readString(metadata.display_name) ||
      user?.email?.split("@")[0] ||
      "",
    bio: readString(metadata.bio),
    native_language: readNative(metadata.native_language),
    practicing: readPracticing(metadata.practicing),
    location: readString(metadata.location),
  };

  const displayName = initial.display_name || "friend";
  const email = user?.email ?? "";

  return (
    <>
      {/* Header */}
      <section className="bg-paper border-b-2 border-ink">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="label-mono text-coral mb-3.5">
            <Link href="/account" className="hover:text-ink transition-colors">
              Account
            </Link>
            <span className="mx-2 text-ink/30">·</span>
            <span className="text-sage">Profile</span>
          </div>
          <h1 className="font-display font-extrabold text-ink text-[48px] md:text-[88px] leading-[0.95] tracking-tight normal-case max-w-[16ch]">
            Your profile.
          </h1>
          <p className="mt-5 max-w-[58ch] text-[17px] md:text-[19px] leading-[1.55] text-ink/80">
            Edit what we call you, where you&apos;re based, and what
            you&apos;re practicing. Used to personalize the app and (later) to
            help workshop organizers pair you with a partner.
          </p>
        </div>
      </section>

      {/* Identity + form */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-12 md:gap-16 lg:gap-20 items-start">
          <IdentityCard displayName={displayName} email={email} />
          <ProfileForm initial={initial} />
        </div>
      </section>
    </>
  );
}

// --- typed readers for unknown JSONB values -------------------------------

function readString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function readNative(v: unknown): NativeLanguage | "" {
  return typeof v === "string" && (NATIVE_LANGUAGES as readonly string[]).includes(v)
    ? (v as NativeLanguage)
    : "";
}

function readPracticing(v: unknown): PracticingLanguage | "" {
  return typeof v === "string" && (PRACTICING_LANGUAGES as readonly string[]).includes(v)
    ? (v as PracticingLanguage)
    : "";
}
