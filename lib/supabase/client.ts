/**
 * lib/supabase/client.ts
 *
 * NOTE: This singleton is intentionally NOT used for auth-bearing calls.
 * The frontend auth system uses @supabase/ssr (cookie-based sessions) via:
 *   - lib/auth/browser.ts  → getBrowserSupabase()   (client components)
 *   - lib/auth/server.ts   → getServerSupabase()    (server components)
 *
 * This client is retained for anonymous, non-auth calls only (e.g. public
 * RPCs like get_platform_stats). It returns null instead of throwing when
 * env vars are missing so pages degrade gracefully in local dev / CI.
 *
 * For any call that requires a logged-in user, use the injected-client
 * pattern in vocabulary-progress.ts — pass in getBrowserSupabase() or
 * getServerSupabase() from the call site, not this singleton.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let _client: SupabaseClient<Database> | null = null

export function getAnonSupabase(): SupabaseClient<Database> | null {
  if (_client) return _client

  const url     = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return null
  if (url.includes('YOUR-PROJECT-REF')) return null

  _client = createClient<Database>(url, anonKey)
  return _client
}

// Legacy named export — kept so any existing imports don't break,
// but callers should prefer getAnonSupabase() for clarity.
export const supabase = {
  get client() { return getAnonSupabase() }
}
