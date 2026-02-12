import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { sendClientNotification } from '@/lib/email';
import { getAppUrl } from '@/lib/app-url';

export async function POST() {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { supabase, user } = auth;

  // Check if already sent (idempotent)
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_email_sent_at, email')
    .eq('id', user.id)
    .single();

  const sentAt = (profile?.onboarding_email_sent_at as Record<string, string>) ?? {};
  if (sentAt.welcome) {
    return NextResponse.json({ skipped: true, reason: 'already_sent' });
  }

  const email = profile?.email || user.email;
  if (!email) {
    return NextResponse.json({ error: 'No email found' }, { status: 400 });
  }

  try {
    await sendClientNotification(
      email,
      'Welcome to PRBuild',
      "Here's how it works: 1) Fill out a quick form with your news, 2) AI + journalist panel crafts your release, 3) Review, revise, publish. Takes about 5 minutes.",
      'Submit Your First Release',
      `${getAppUrl()}/dashboard/new-request`
    );

    // Record send
    await supabase
      .from('profiles')
      .update({
        onboarding_email_sent_at: { ...sentAt, welcome: new Date().toISOString() },
      })
      .eq('id', user.id);

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error('Failed to send welcome email:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
