import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

/** Admin only: update free user (releases count or remove). Uses service role. */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const userId = (body.userId as string)?.trim();
  const action = body.action as string; // 'update' | 'remove'
  const freeReleasesRemaining = body.freeReleasesRemaining as number | undefined;
  const unlimited = body.unlimited === true;

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const admin = createAdminClient();

  if (action === 'remove') {
    const { error } = await admin.from('profiles').update({ is_free_user: false, free_releases_remaining: 0 }).eq('id', userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  const releases = unlimited ? -1 : Math.max(0, Number(freeReleasesRemaining) ?? 0);
  const { error } = await admin
    .from('profiles')
    .update({ free_releases_remaining: releases })
    .eq('id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
