// lib/auth.ts
// Shared authentication helpers to eliminate duplicated auth logic across API routes.

import { createClient, createAdminClient } from '@/lib/supabase/server';

interface AuthResult {
  user: { id: string; email?: string };
  supabase: Awaited<ReturnType<typeof createClient>>;
}

interface AdminAuthResult extends AuthResult {
  profile: { role: string };
}

/**
 * Require an authenticated user. Returns null if no session.
 */
export async function requireAuth(): Promise<AuthResult | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { user, supabase };
}

/**
 * Require an authenticated admin user.
 * Tries the regular client first; falls back to service-role client
 * (bypasses RLS) when the profile isn't readable via the anon key.
 * Returns null if not authenticated or not admin.
 */
export async function requireAdmin(): Promise<AdminAuthResult | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Try regular client first
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') {
    return { user, profile, supabase };
  }

  // Fallback: service-role client bypasses RLS
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createAdminClient();
      const { data } = await admin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (data?.role === 'admin') {
        return { user, profile: data, supabase };
      }
    } catch { /* ignore */ }
  }

  return null;
}
