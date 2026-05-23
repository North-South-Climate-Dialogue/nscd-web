import { signOutAction } from "@/app/account/actions";

/**
 * Sticky identity card shared across /account/* pages. Shows initials avatar,
 * display name, email, and a log-out button.
 */
export default function IdentityCard({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  const initials = getInitials(displayName);

  return (
    <article className="border-2 border-ink bg-paper shadow-thunk-lg p-7 md:p-9 min-w-0 md:sticky md:top-8 self-start">
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="w-16 h-16 md:w-20 md:h-20 bg-coral border-2 border-ink flex items-center justify-center font-display font-extrabold text-ink text-[24px] md:text-[30px] leading-none shrink-0"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="label-mono text-sage mb-1">Signed in as</div>
          <div
            className="font-display font-extrabold text-ink text-[20px] md:text-[24px] leading-tight tracking-tight normal-case"
            style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
          >
            {displayName}
          </div>
          <div className="mt-1.5 font-mono text-ink/70 text-[13px] break-all">
            {email}
          </div>
        </div>
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
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
