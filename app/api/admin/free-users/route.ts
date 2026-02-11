import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/** Admin only: list profiles with is_free_user = true, plus approved invites awaiting signup. */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let profile: { role?: string } | null = null;
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  profile = p;
  if (!profile && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createAdminClient();
      const { data } = await admin.from('profiles').select('role').eq('id', user.id).single();
      profile = data;
    } catch {
      /* ignore */
    }
  }
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const cols = 'id, email, full_name, company_name, is_free_user, free_releases_remaining, created_at';
  let lastError: { message?: string } | null = null;

  let users: Array<{ id: string; email: string; full_name: string | null; company_name: string | null; is_free_user: boolean; free_releases_remaining: number; created_at: string }> = [];
  const fetchProfiles = async (
    client: Awaited<ReturnType<typeof createClient>> | ReturnType<typeof createAdminClient>
  ) => {
    const { data, error } = await client
      .from('profiles')
      .select(cols)
      .order('created_at', { ascending: false });
    if (error) {
      lastError = error;
      return [];
    }
    return (data || []).filter((p) => p.is_free_user === true || p.is_free_user === 'true');
  };

  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient();
      users = await fetchProfiles(admin);
    }
  } catch {
    /* fallback */
  }
  if (users.length === 0) {
    const fallback = await fetchProfiles(supabase);
    if (fallback.length > 0) {
      users = fallback;
    } else if (lastError) {
      const errMsg = String((lastError as Error).message || 'Failed to fetch');
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }
  }

  // Also include approved invites awaiting signup (no profile yet) — use admin client to bypass RLS
  let invited: Array<{ id: string; email: string; full_name: null; company_name: null; is_free_user: true; free_releases_remaining: number; created_at: string; _invite?: true }> = [];
  try {
    let inviteClient: Awaited<ReturnType<typeof createClient>> | ReturnType<typeof createAdminClient> = supabase;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        inviteClient = createAdminClient();
      } catch {
        /* use supabase fallback */
      }
    }
    const { data: invitesData } = await inviteClient
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
