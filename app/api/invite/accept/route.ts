import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const token = (body.token as string)?.trim();
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: invite, error: inviteError } = await admin
      .from('invites')
      .select('id, email, free_releases_remaining')
      .eq('token', token)
      .is('used_at', null)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invalid or already used invite' }, { status: 400 });
    }

    const inviteEmail = (invite.email as string).trim().toLowerCase();
    const userEmail = (user.email || '').trim().toLowerCase();
    if (inviteEmail !== userEmail) {
      return NextResponse.json({ error: 'Invite email does not match your account' }, { status: 400 });
    }

    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        is_free_user: true,
        free_releases_remaining: invite.free_releases_remaining,
      })
      .eq('id', user.id);

    if (updateProfileError) {
      return NextResponse.json({ error: updateProfileError.message }, { status: 500 });
    }

    await admin
      .from('invites')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invite.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 });
  }
}
