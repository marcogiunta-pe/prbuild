import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';

/** Public: submit a request for free access. Creates a pending invite; admin must approve before they can set password. */
export async function POST(request: NextRequest) {
  try {
    const ip = getRateLimitKey(request);
    const { success, retryAfter } = rateLimit(`invite-request:${ip}`, { maxRequests: 3, windowMs: 60 * 60 * 1000 });
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = (body.email as string)?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: existing } = await admin
      .from('invites')
      .select('id')
      .eq('email', email)
      .is('used_at', null)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'A request for this email is already pending or approved.' }, { status: 400 });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const { error } = await admin
      .from('invites')
      .insert({
        email,
        token,
        free_releases_remaining: 3,
        approved_at: null,
      });

    if (error) {
      console.error('Error creating invite request:', error);
      return NextResponse.json({ error: 'Request failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Request submitted. You can sign in once an admin approves your request.',
    });
  } catch (err) {
    console.error('Error in invite request:', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
