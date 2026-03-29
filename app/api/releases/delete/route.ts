import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

const RequestSchema = z.object({
  releaseId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid release ID' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Fetch the release to check ownership and status
    const { data: release, error: fetchErr } = await admin
      .from('release_requests')
      .select('client_id, status')
      .eq('id', parsed.data.releaseId)
      .single();

    if (fetchErr || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // Check permissions
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isOwner = release.client_id === user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Published releases can only be deleted by admin
    if (release.status === 'published' && !isAdmin) {
      return NextResponse.json({ error: 'Published releases can only be deleted by an admin' }, { status: 403 });
    }

    // Delete related records first (FK constraints)
    const { error: actErr } = await admin.from('activity_log').delete().eq('release_request_id', parsed.data.releaseId);
    if (actErr) console.error('activity_log delete error:', actErr);

    const { error: showErr } = await admin.from('showcase_releases').delete().eq('release_request_id', parsed.data.releaseId);
    if (showErr) console.error('showcase delete error:', showErr);

    // newsletter_sends uses release_ids UUID[] array — skip FK cleanup (no direct FK constraint)

    // Delete the release
    const { error: deleteErr } = await admin
      .from('release_requests')
      .delete()
      .eq('id', parsed.data.releaseId);

    if (deleteErr) {
      console.error('Delete error:', deleteErr);
      return NextResponse.json({ error: `Failed to delete: ${deleteErr.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete release error:', error);
    return NextResponse.json({ error: 'Failed to delete release' }, { status: 500 });
  }
}
