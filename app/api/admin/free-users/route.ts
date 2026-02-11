import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Admin only: list profiles with is_free_user = true, plus approved invites awaiting signup. */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const admin = createAdminClient();
  const cols = 'id, email, full_name, company_name, is_free_user, free_releases_remaining, created_at';

  const { data, error } = await admin
    .from('profiles')
    .select(cols)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching free users:', error);
    return NextResponse.json({ error: 'Failed to fetch free users' }, { status: 500 });
  }

  const users = (data || []).filter((p) => p.is_free_user === true || p.is_free_user === 'true');

  // Also include approved invites awaiting signup (no profile yet)
  let invited: Array<{ id: string; email: string; full_name: null; company_name: null; is_free_user: true; free_releases_remaining: number; created_at: string; _invite?: true }> = [];
  try {
    const { data: invitesData } = await admin
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
