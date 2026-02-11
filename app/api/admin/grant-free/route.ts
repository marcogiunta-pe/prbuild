import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

/** Admin only: grant free access to a user by id. Uses service role to update. */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const userId = (body.userId as string)?.trim();
  const freeReleases = body.freeReleases ?? 3;
  const unlimited = body.unlimited === true;

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const admin = createAdminClient();
  const releases = unlimited ? -1 : Math.max(1, Number(freeReleases) || 3);

  const { error } = await admin
    .from('profiles')
    .update({
      is_free_user: true,
      free_releases_remaining: releases,
    })
    .eq('id', userId);

  if (error) {
    console.error('Error granting free access:', error);
    return NextResponse.json({ error: 'Failed to grant free access' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
