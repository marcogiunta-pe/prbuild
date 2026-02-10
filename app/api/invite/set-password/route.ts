import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = (body.token as string)?.trim();
    const password = (body.password as string)?.trim();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: invite, error: inviteError } = await admin
      .from('invites')
      .select('id, email, free_releases_remaining, approved_at')
      .eq('token', token)
      .is('used_at', null)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invalid or already used link' }, { status: 400 });
    }
    if (!invite.approved_at) {
      return NextResponse.json({ error: 'Your request is still pending approval. You can set your password once an admin approves it.' }, { status: 400 });
    }

    const email = (invite.email as string).trim().toLowerCase();

    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      if (createError.message?.includes('already been registered') || createError.message?.includes('already exists')) {
        return NextResponse.json({
          error: 'An account with this email already exists. Use Sign in or Forgot password instead.',
        }, { status: 400 });
      }
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    if (!userData.user) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    await admin
      .from('profiles')
      .update({
        is_free_user: true,
        free_releases_remaining: invite.free_releases_remaining,
      })
      .eq('id', userData.user.id);

    await admin
      .from('invites')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invite.id);

    return NextResponse.json({ success: true, message: 'Account created. You can sign in now.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
