import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Get current credits
    const { data: profile } = await admin
      .from('profiles')
      .select('free_releases_remaining, role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Admins and unlimited users don't decrement
    if (profile.role === 'admin' || profile.free_releases_remaining === -1) {
      return NextResponse.json({ success: true, remaining: profile.free_releases_remaining });
    }

    // Decrement
    const newRemaining = Math.max(0, (profile.free_releases_remaining || 0) - 1);
    await admin
      .from('profiles')
      .update({ free_releases_remaining: newRemaining })
      .eq('id', user.id);

    return NextResponse.json({ success: true, remaining: newRemaining });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to decrement credits' }, { status: 500 });
  }
}
