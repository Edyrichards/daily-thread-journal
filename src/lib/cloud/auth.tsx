import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './client';
import { syncNow } from './sync';

interface AuthState {
  ready: boolean;
  configured: boolean;
  user: User | null;
  session: Session | null;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);
const notConfigured = { error: 'Cloud sync isn’t set up yet.' };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setReady(true);
      if (data.session) syncNow().catch(() => {});
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s) syncNow().catch(() => {});
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthState = {
    ready,
    configured: isSupabaseConfigured,
    user,
    session,
    signInWithPassword: async (email, password) => {
      if (!supabase) return notConfigured;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    signUp: async (email, password, name) => {
      if (!supabase) return notConfigured;
      const { error } = await supabase.auth.signUp({
        email, password, options: { data: { display_name: name } },
      });
      return error ? { error: error.message } : {};
    },
    signInWithGoogle: async () => {
      if (!supabase) return notConfigured;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google', options: { redirectTo: window.location.origin },
      });
      return error ? { error: error.message } : {};
    },
    signOut: async () => { await supabase?.auth.signOut(); },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = (): AuthState => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
