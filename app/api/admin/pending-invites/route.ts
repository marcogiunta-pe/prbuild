import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

/** Admin only: list invites pending approval (approved_at null, used_at null). */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth) {
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
