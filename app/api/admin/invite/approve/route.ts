import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/app-url';

/** Admin only: approve a pending invite. Sets approved_at; returns set-password link to share. */
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json().catch(() => ({}));
    const id = (body.id as string)?.trim();
    if (!id) {
      return NextResponse.json({ error: 'Invite id is required' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: invite, error: fetchError } = await admin
      .from('invites')
      .select('id, token, email')
      .eq('id', id)
      .is('approved_at', null)
      .is('used_at', null)
      .single();

    if (fetchError || !invite) {
      return NextResponse.json({ error: 'Invite not found or already approved/used' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { error: updateError } = await admin
      .from('invites')
      .update({ approved_at: now })
      .eq('id', invite.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const setPasswordLink = `${getAppUrl()}/set-password?token=${invite.token}`;
    return NextResponse.json({
      success: true,
      message: `Approved. Share this link with ${invite.email} so they can set their password and sign in.`,
      setPasswordLink,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to approve';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
