import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/auth/config";

/**
 * Refresh Supabase auth tokens on every request so server components see the
 * current user. No-op when env vars are missing.
 *
 * IMPORTANT — never read from / write to the Supabase client between
 * `createServerClient` and `getUser`; that ensures the cookie refresh
 * completes before any route handlers run.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const env = getSupabaseEnv();
  if (!env) return response;

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touches the session and refreshes cookies if needed.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Skip Next internals and static asset extensions.
    "/((?!_next/static|_next/image|favicon.ico|logo|qiqi|blog/.*\\.(?:jpg|jpeg|png|webp|svg|gif)|about/.*\\.(?:jpg|jpeg|png|webp|svg|gif)).*)",
  ],
};
