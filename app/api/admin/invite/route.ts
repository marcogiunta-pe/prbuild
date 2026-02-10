import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendInviteEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const email = (body.email as string)?.trim().toLowerCase();
    const freeReleases = body.freeReleases ?? 3;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const admin = createAdminClient();
    const releases = freeReleases === 'unlimited' || freeReleases === -1 ? -1 : Math.max(1, Number(freeReleases) || 3);

    const { error: insertError } = await admin
      .from('invites')
      .insert({
        email,
        token,
        free_releases_remaining: releases,
      });

    if (insertError) {
      const msg = insertError.message || '';
      const hint = msg.includes('does not exist') || msg.includes('relation')
        ? ' Create the invites table in Supabase (run the SQL from DEPLOY/schema).'
        : '';
      return NextResponse.json({ error: msg + hint }, { status: 500 });
    }

    try {
      await sendInviteEmail(email, token, releases);
    } catch (emailErr) {
      const message = emailErr instanceof Error ? emailErr.message : String(emailErr);
      const hint = message.includes('RESEND_API_KEY')
        ? ' Add RESEND_API_KEY in Vercel (and optionally NOTIFICATIONS_FROM_EMAIL for Jarvis).'
        : message.includes('from') || message.includes('domain')
        ? ' Verify your sender domain in Resend, or set NOTIFICATIONS_FROM_EMAIL to a verified address.'
        : '';
      return NextResponse.json({ error: message + hint }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Invite sent to ${email}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send invite';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
