'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/app-url';
import crypto from 'crypto';

async function ensureAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Admin only');
  return admin;
}

export async function addInviteByEmail(formData: FormData): Promise<{ ok: boolean; message: string; setPasswordLink?: string }> {
  try {
    const admin = await ensureAdmin();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const unlimited = formData.get('unlimited') === 'on';
    const releases = unlimited ? -1 : Math.max(1, Number(formData.get('releases')) || 3);
    if (!email) return { ok: false, message: 'Email is required' };
    const token = crypto.randomBytes(24).toString('hex');
    await admin.from('invites').insert({
      email,
      token,
      free_releases_remaining: releases,
      approved_at: new Date().toISOString(),
    });
    const setPasswordLink = `${getAppUrl()}/set-password?token=${token}`;
    revalidatePath('/admin/free-users');
    return { ok: true, message: `Added ${email}. Share the set-password link.`, setPasswordLink };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed to add' };
  }
}

export async function approveInvite(inviteId: string): Promise<{ ok: boolean; message: string; setPasswordLink?: string }> {
  try {
    const admin = await ensureAdmin();
    const { data: invite } = await admin.from('invites').select('id, token, email').eq('id', inviteId).is('approved_at', null).is('used_at', null).single();
    if (!invite) return { ok: false, message: 'Invite not found' };
    await admin.from('invites').update({ approved_at: new Date().toISOString() }).eq('id', inviteId);
    const setPasswordLink = `${getAppUrl()}/set-password?token=${invite.token}`;
    revalidatePath('/admin/free-users');
    return { ok: true, message: `Approved. Share the set-password link with ${invite.email}.`, setPasswordLink };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function grantFreeAccess(userId: string, releases: number, unlimited: boolean): Promise<{ ok: boolean; message: string }> {
  try {
    const admin = await ensureAdmin();
    const r = unlimited ? -1 : Math.max(1, releases);
    await admin.from('profiles').update({ is_free_user: true, free_releases_remaining: r }).eq('id', userId);
    revalidatePath('/admin/free-users');
    return { ok: true, message: 'Granted free access' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function removeFreeUser(userId: string): Promise<{ ok: boolean; message: string }> {
  try {
    const admin = await ensureAdmin();
    await admin.from('profiles').update({ is_free_user: false, free_releases_remaining: 0 }).eq('id', userId);
    revalidatePath('/admin/free-users');
    return { ok: true, message: 'Removed' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function updateFreeUserReleases(userId: string, releases: number, unlimited: boolean): Promise<{ ok: boolean; message: string }> {
  try {
    const admin = await ensureAdmin();
    const r = unlimited ? -1 : Math.max(0, releases);
    await admin.from('profiles').update({ free_releases_remaining: r }).eq('id', userId);
    revalidatePath('/admin/free-users');
    return { ok: true, message: 'Updated' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed' };
  }
}
