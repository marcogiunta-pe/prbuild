import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

const RequestSchema = z.object({
  releaseId: z.string().uuid(),
  content: z.string().min(1),
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
      return NextResponse.json({ error: 'Release ID and content required' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify ownership
    const { data: release } = await admin
      .from('release_requests')
      .select('client_id')
      .eq('id', parsed.data.releaseId)
      .single();

    if (!release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (release.client_id !== user.id && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await admin
      .from('release_requests')
      .update({
        client_edited_content: parsed.data.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.data.releaseId);

    if (error) {
      return NextResponse.json({ error: `Failed to save: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}
