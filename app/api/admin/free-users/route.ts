import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

/** Admin only: list profiles with is_free_user = true, plus approved invites awaiting signup. */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const cols = 'id, email, full_name, company_name, is_free_user, free_releases_remaining, created_at';
  let lastError: { message: string } | null = null;

  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('profiles')
        .select(cols)
        .eq('is_free_user', true)
        .order('created_at', { ascending: false });
      if (!error) {
        return NextResponse.json({ users: data || [] });
      }
      lastError = error;
    }
  } catch {
    /* fallback */
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(cols)
    .eq('is_free_user', true)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message || lastError?.message || 'Failed to fetch' }, { status: 500 });
  }

  const users = data || [];

  // Also include approved invites awaiting signup (no profile yet)
  let invited: Array<{ id: string; email: string; full_name: null; company_name: null; is_free_user: true; free_releases_remaining: number; created_at: string; _invite?: true }> = [];
  try {
    const { data: invitesData } = await supabase
      .from('invites')
      .select('id, email, free_releases_remaining, created_at')
      .not('approved_at', 'is', null)
      .is('used_at', null);
    if (invitesData?.length) {
      invited = invitesData.map((inv) => ({
        id: inv.id,
        email: inv.email,
        full_name: null,
        company_name: null,
        is_free_user: true as const,
        free_releases_remaining: inv.free_releases_remaining ?? 3,
        created_at: inv.created_at,
        _invite: true as const,
      }));
    }
  } catch {
    /* ignore */
  }

  return NextResponse.json({
    users: [...users, ...invited].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  });
}
