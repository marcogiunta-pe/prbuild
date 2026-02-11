import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

/** Returns current user's profile including free user status. Uses admin client so we get accurate is_free_user. */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile, error } = await admin
    .from('profiles')
    .select('company_name, company_website, full_name, email, is_free_user, free_releases_remaining')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: error?.message || 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...profile,
    is_free_user: !!profile.is_free_user,
    free_releases_remaining: profile.free_releases_remaining ?? 0,
  });
}
