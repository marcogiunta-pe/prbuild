// app/api/releases/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

// GET - Get a single release
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user, supabase } = auth;

    const { data: release, error } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // Check access - admin can see all, clients can only see own
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && release.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ release });
  } catch (error) {
    console.error('Error fetching release:', error);
    return NextResponse.json({ error: 'Failed to fetch release' }, { status: 500 });
  }
}

// PATCH - Update a release
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user, supabase } = auth;

    const { data: release } = await supabase
      .from('release_requests')
      .select('client_id')
      .eq('id', params.id)
      .single();

    if (!release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // Check access
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && release.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Whitelist allowed fields to prevent mass assignment
    const clientAllowedFields = [
      'client_feedback', 'client_feedback_at', 'client_edited_content',
      'status', // only for client_feedback, client_approved
      'admin_refined_content', 'pending_rewrite_content', // when accepting/rejecting rewrite
    ] as const;
    const adminAllowedFields = [
      ...clientAllowedFields,
      'admin_notes', 'admin_reviewed_by', 'admin_reviewed_at',
      'ai_selected_headline', 'category', 'tags', 'industry',
      'quality_score', 'quality_notes', 'quality_reviewed_by', 'quality_reviewed_at',
      'final_content', 'final_approved_at', 'sent_to_client_at',
    ] as const;
    
    const isAdmin = profile?.role === 'admin';
    const allowedFields = isAdmin ? adminAllowedFields : clientAllowedFields;
    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        if (!isAdmin && key === 'status' && !['client_feedback', 'client_approved'].includes(body[key])) continue;
        updates[key] = body[key];
      }
    }

    const { data: updated, error } = await supabase
      .from('release_requests')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating release:', error);
      return NextResponse.json({ error: 'Failed to update release' }, { status: 500 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      release_request_id: params.id,
      user_id: user.id,
      action: 'release_updated',
      details: { fields: Object.keys(updates) },
    });

    return NextResponse.json({ release: updated });
  } catch (error) {
    console.error('Error updating release:', error);
    return NextResponse.json({ error: 'Failed to update release' }, { status: 500 });
  }
}
