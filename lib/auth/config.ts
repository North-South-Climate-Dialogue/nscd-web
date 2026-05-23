/**
 * Auth configuration helpers — frontend-only.
 *
 * The friend-authored `lib/supabase/client.ts` throws at module-load when env
 * vars are missing. We don't want signup/login pages to crash before the user
 * has even configured Supabase, so we expose this small util to detect that
 * state and degrade gracefully.
 */

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/**
 * Read Supabase env vars. Returns null if they're missing or still set to the
 * placeholder string from `.env.local.example`.
 */
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (url.includes("YOUR-PROJECT-REF") || anonKey.includes("your-anon-public-key")) {
    return null;
  }
  return { url, anonKey };
}

export function isAuthConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
