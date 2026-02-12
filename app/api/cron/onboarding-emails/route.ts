import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendClientNotification } from '@/lib/email';
import { getAppUrl } from '@/lib/app-url';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get profiles created in last 7 days
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, created_at, onboarding_email_sent_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .eq('role', 'client');

  if (error) {
    console.error('Failed to query profiles:', error);
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }

  let tipsSent = 0;
  let nudgesSent = 0;
  const appUrl = getAppUrl();

  for (const profile of profiles ?? []) {
    const sentAt = (profile.onboarding_email_sent_at as Record<string, string>) ?? {};
    const createdAt = new Date(profile.created_at);
    const hoursSinceSignup = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    // Check if user has any releases
    const { count } = await supabase
      .from('release_requests')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', profile.id);

    const hasReleases = (count ?? 0) > 0;

    // Tips email: 24h+ since signup, no releases, not already sent
    if (hoursSinceSignup >= 24 && !sentAt.tips && !hasReleases) {
      try {
        await sendClientNotification(
          profile.email,
          'Quick tips for a great press release',
          '3 tips from journalists who read hundreds of releases: 1) Lead with the news — put the most important fact in the first sentence. 2) Include specific numbers — "$2M raised" beats "significant funding." 3) Keep it under 500 words — journalists skim, so every sentence needs to earn its place.',
          'Create Your Release',
          `${appUrl}/dashboard/new-request`
        );

        await supabase
          .from('profiles')
          .update({
            onboarding_email_sent_at: { ...sentAt, tips: new Date().toISOString() },
          })
          .eq('id', profile.id);

        tipsSent++;
      } catch (err) {
        console.error(`Failed to send tips email to ${profile.id}:`, err);
      }
    }

    // Re-read sentAt in case tips was just added
    const updatedSentAt = tipsSent > 0 && !sentAt.tips
      ? { ...sentAt, tips: new Date().toISOString() }
      : sentAt;

    // Nudge email: 72h+ since signup, no releases, not already sent
    if (hoursSinceSignup >= 72 && !updatedSentAt.nudge && !hasReleases) {
      try {
        await sendClientNotification(
          profile.email,
          'Your free press release is waiting',
          '800+ companies have published with PRBuild, with a 23% journalist pickup rate. Your first release is free — no credit card required. The whole process takes about 5 minutes.',
          'Get Started Now',
          `${appUrl}/dashboard/new-request`
        );

        await supabase
          .from('profiles')
          .update({
            onboarding_email_sent_at: { ...updatedSentAt, nudge: new Date().toISOString() },
          })
          .eq('id', profile.id);

        nudgesSent++;
      } catch (err) {
        console.error(`Failed to send nudge email to ${profile.id}:`, err);
      }
    }
  }

  return NextResponse.json({
    processed: profiles?.length ?? 0,
    tipsSent,
    nudgesSent,
  });
}
