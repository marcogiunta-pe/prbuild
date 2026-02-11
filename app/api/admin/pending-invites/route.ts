import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

/** Admin only: list invites pending approval (approved_at null, used_at null). */
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
      const ac = createAdminClient();
      const { data } = await ac.from('profiles').select('role').eq('id', user.id).single();
      profile = data;
    } catch { /* ignore */ }
  }
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: invites, error } = await admin
    .from('invites')
    .select('id, email, created_at, free_releases_remaining')
    .is('approved_at', null)
    .is('used_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending invites:', error);
    return NextResponse.json({ error: 'Failed to fetch pending invites' }, { status: 500 });
  }

  return NextResponse.json({ invites: invites || [] });
}
