/**
 * Server-side Supabase client for auth flows.
 *
 * Reads cookies for session resolution. Returns null if env vars are missing,
 * so server components / route handlers can degrade gracefully.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

export function getServerSupabase(): SupabaseClient | null {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — cookies are read-only there.
          // Middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Convenience: return the currently signed-in user (or null) using the server
 * client. Use in server components / route handlers to gate access.
 */
export async function getCurrentUser() {
  const supabase = getServerSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}
