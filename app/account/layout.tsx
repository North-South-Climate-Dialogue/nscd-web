import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth/server";
import { isAuthConfigured } from "@/lib/auth/config";

/**
 * Auth guard for every /account/* page. Pushes signed-out visitors to /login
 * with a ?next= return-to so they land back on the protected route after
 * signing in.
 */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthConfigured()) {
    // Surface the configuration state instead of bouncing to /login.
    return (
      <section className="max-w-[820px] mx-auto px-6 md:px-8 py-20 min-h-[60vh]">
        <div className="label-mono text-coral mb-3.5">Account</div>
        <h1 className="font-display font-extrabold text-ink text-[44px] md:text-[64px] leading-[1] tracking-tight normal-case max-w-[14ch]">
          Auth isn&apos;t configured yet.
        </h1>
        <p className="mt-6 max-w-[58ch] text-ink/80 text-[17px] leading-[1.55]">
          The account area unlocks once Supabase credentials are added to{" "}
          <code className="font-mono bg-ink/8 px-1 py-0.5 border border-ink/15">.env.local</code>.
          Until then you can keep using the glossary, flashcards, and quiz — your
          progress will save locally on this device.
        </p>
      </section>
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    const h = headers();
    const path = h.get("x-invoke-path") ?? "/account";
    redirect(`/login?next=${encodeURIComponent(path)}`);
  }

  return <>{children}</>;
}
