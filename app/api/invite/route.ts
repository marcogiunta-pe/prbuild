import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: invite, error } = await admin
    .from('invites')
    .select('email, free_releases_remaining, approved_at')
    .eq('token', token)
    .is('used_at', null)
    .not('approved_at', 'is', null)
    .single();

  if (error || !invite) {
    return NextResponse.json({ error: 'Invalid, expired, or not yet approved' }, { status: 404 });
  }

  return NextResponse.json({ email: invite.email, free_releases_remaining: invite.free_releases_remaining });
}
