import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ViteEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

const env = ((import.meta as unknown as { env?: ViteEnv }).env ?? {}) as ViteEnv;

const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured: boolean = !!supabase;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase client não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
    );
  }
  return supabase;
}
