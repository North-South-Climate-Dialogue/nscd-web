import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/auth/server";

/**
 * Handles the redirect Supabase sends after a user clicks an email-confirmation
 * (or password-reset) link.
 *
 *   ?code=...   — exchange for a session
 *   ?next=...   — destination after success (default: /account)
 *   ?error=...  — surface error in querystring on /login
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/account";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing-code", url.origin),
    );
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.redirect(
      new URL("/login?error=auth-not-configured", url.origin),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error.message)}`,
        url.origin,
      ),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
