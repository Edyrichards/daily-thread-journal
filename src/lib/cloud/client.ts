import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True once VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are provided at build time. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * The Supabase client, or `null` when not configured. Everything that touches
 * the cloud must check `isSupabaseConfigured` / null first so the app runs
 * fully local-only until credentials are added.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
