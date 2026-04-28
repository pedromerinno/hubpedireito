import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface ServerEnv {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

function readEnv(env?: ServerEnv): ServerEnv {
  return env ?? (process.env as ServerEnv);
}

/** Client com ANON_KEY — para inserts públicos (formulários). */
export function getSupabaseServer(env?: ServerEnv): SupabaseClient | null {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = readEnv(env);
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/** Client com SERVICE_ROLE_KEY — contorna RLS; use apenas em rotas autenticadas. */
export function getSupabaseAdmin(env?: ServerEnv): SupabaseClient | null {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY } = readEnv(env);
  const key = SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createClient(SUPABASE_URL, key);
}
