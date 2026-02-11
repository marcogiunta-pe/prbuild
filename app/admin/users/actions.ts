'use server';

import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

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

export async function addUser(formData: FormData): Promise<{ ok: boolean; message: string; tempPassword?: string; email?: string }> {
  try {
    const admin = await ensureAdmin();
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const fullName = (formData.get('fullName') as string)?.trim() || '';
    if (!email) return { ok: false, message: 'Email is required' };
    const tempPassword = crypto.randomBytes(12).toString('base64url').slice(0, 12) + 'Aa1!'; // 12 random + ensure complexity
    const { data: authUser, error: authErr } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName, force_password_reset: true },
    });
    if (authErr) {
      if (authErr.message?.includes('already') || authErr.message?.includes('exists')) {
        return { ok: false, message: 'A user with this email already exists.' };
      }
      return { ok: false, message: authErr.message };
    }
    if (!authUser.user) return { ok: false, message: 'Failed to create user' };
    await admin.from('profiles').upsert(
      { id: authUser.user.id, email, full_name: fullName || null, is_free_user: true, free_releases_remaining: 3, role: 'client' },
      { onConflict: 'id' }
    );
    revalidatePath('/admin/users');
    return { ok: true, message: `User created. Share this temporary password: ${tempPassword} — they must reset it on first login.`, tempPassword, email };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function grantFree(userId: string, releases: number, unlimited: boolean): Promise<{ ok: boolean; message: string }> {
  try {
    const admin = await ensureAdmin();
    const r = unlimited ? -1 : Math.max(1, releases);
    await admin.from('profiles').update({ is_free_user: true, free_releases_remaining: r }).eq('id', userId);
    revalidatePath('/admin/users');
    return { ok: true, message: 'Granted free access' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function removeFree(userId: string): Promise<{ ok: boolean; message: string }> {
  try {
    const admin = await ensureAdmin();
    await admin.from('profiles').update({ is_free_user: false, free_releases_remaining: 0 }).eq('id', userId);
    revalidatePath('/admin/users');
    return { ok: true, message: 'Removed free access' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed' };
  }
}

export async function deleteUser(userId: string): Promise<{ ok: boolean; message: string }> {
  try {
    const admin = await ensureAdmin();
    await admin.auth.admin.deleteUser(userId);
    revalidatePath('/admin/users');
    return { ok: true, message: 'User deleted' };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'Failed' };
  }
}
