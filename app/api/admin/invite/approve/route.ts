import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { getAppUrl } from '@/lib/app-url';

/** Admin only: approve a pending invite. Sets approved_at; returns set-password link to share. */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }
    const { user } = auth;

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
      console.error('Error approving invite:', updateError);
      return NextResponse.json({ error: 'Failed to approve invite' }, { status: 500 });
    }

    const setPasswordLink = `${getAppUrl()}/set-password?token=${invite.token}`;
    return NextResponse.json({
      success: true,
      message: `Approved. Share this link with ${invite.email} so they can set their password and sign in.`,
      setPasswordLink,
    });
  } catch (err) {
    console.error('Error in invite approval:', err);
    return NextResponse.json({ error: 'Failed to approve invite' }, { status: 500 });
  }
}
