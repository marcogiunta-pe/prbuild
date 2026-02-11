import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { getAppUrl } from '@/lib/app-url';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
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
        approved_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error creating invite:', insertError);
      return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
    }

    const setPasswordLink = `${getAppUrl()}/set-password?token=${token}`;
    return NextResponse.json({
      success: true,
      message: `Added ${email}. Share the set-password link with them so they can create an account and sign in.`,
      setPasswordLink,
    });
  } catch (err) {
    console.error('Error in invite creation:', err);
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}
