import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function POST() {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { supabase, user } = auth;

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_dismissed_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to dismiss' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
