import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

/** Admin only: search profiles by email (is_free_user = false). Uses service role so we find everyone. */
export async function GET(request: NextRequest) {
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

  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q) {
    return NextResponse.json({ users: [] });
  }

  const admin = createAdminClient();
  const { data: users, error } = await admin
    .from('profiles')
    .select('id, email, full_name, company_name, is_free_user, free_releases_remaining, created_at')
    .ilike('email', `%${q}%`)
    .eq('is_free_user', false)
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: users || [] });
}
