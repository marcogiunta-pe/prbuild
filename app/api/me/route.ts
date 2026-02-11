import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

/** Returns current user's profile including free user status. Creates profile if missing (e.g. trigger delay). */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let profile: { company_name?: string; company_website?: string; full_name?: string; email?: string; is_free_user?: boolean; free_releases_remaining?: number } | null = null;

  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('profiles')
        .select('company_name, company_website, full_name, email, is_free_user, free_releases_remaining')
        .eq('id', user.id)
        .single();
      if (!error && data) profile = data;
    }
  } catch {
    /* fallback */
  }

  if (!profile) {
    const { data } = await supabase
      .from('profiles')
      .select('company_name, company_website, full_name, email, is_free_user, free_releases_remaining')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  // Profile missing — create it (handle_new_user may not have run yet)
  if (!profile && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = createAdminClient();
      const { error: upsertErr } = await admin.from('profiles').upsert(
        {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name,
          role: 'client',
        },
        { onConflict: 'id' }
      );
      if (!upsertErr) {
        profile = {
          company_name: undefined,
          company_website: undefined,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name,
          email: user.email || '',
          is_free_user: false,
          free_releases_remaining: 0,
        };
      }
    } catch {
      /* ignore */
    }
  }

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...profile,
    is_free_user: !!profile.is_free_user,
    free_releases_remaining: profile.free_releases_remaining ?? 0,
  });
}
