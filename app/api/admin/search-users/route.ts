import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

/** Admin only: search profiles by email (is_free_user = false). Uses service role so we find everyone. */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
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
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }

  return NextResponse.json({ users: users || [] });
}
