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

    const userEmail = (user.email || '').trim().toLowerCase();
    const admin = createAdminClient();

    const body = await request.json().catch(() => ({}));
    const token = (body.token as string)?.trim();

    let invite: { id: string; email: string; free_releases_remaining: number } | null = null;

    if (token) {
      const { data, error } = await admin
        .from('invites')
        .select('id, email, free_releases_remaining')
        .eq('token', token)
        .is('used_at', null)
        .not('approved_at', 'is', null)
        .single();
      if (!error && data) {
        const inviteEmail = (data.email as string).trim().toLowerCase();
        if (inviteEmail === userEmail) invite = data;
      }
    }

    if (!invite) {
      const { data, error } = await admin
        .from('invites')
        .select('id, email, free_releases_remaining')
        .eq('email', userEmail)
        .is('used_at', null)
        .not('approved_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) invite = data;
    }

    if (!invite) {
      return NextResponse.json({ success: true });
    }

    // Add the invite's grant to the current balance rather than overwriting it.
    // Overwriting let a user with multiple approved invites (or one who had
    // already spent their credits) reset the counter back to the invite value
    // by re-accepting. -1 means unlimited — leave it untouched.
    const { data: current } = await admin
      .from('profiles')
      .select('free_releases_remaining')
      .eq('id', user.id)
      .single();

    const existing = current?.free_releases_remaining ?? 0;
    const newRemaining =
      existing === -1 ? -1 : existing + invite.free_releases_remaining;

    const { error: updateProfileError } = await admin
      .from('profiles')
      .update({
        is_free_user: true,
        free_releases_remaining: newRemaining,
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
