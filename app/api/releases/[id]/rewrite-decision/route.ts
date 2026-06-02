// app/api/releases/[id]/rewrite-decision/route.ts
// Client accepts or rejects a pending AI rewrite. Accept promotes
// pending_rewrite_content into admin_refined_content; both clear the pending
// buffer. Replaces the former browser writes (handleAcceptRewrite / Reject).
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardRelease } from '@/lib/release-auth';

const Schema = z.object({ decision: z.enum(['accept', 'reject']) });

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'decision must be accept or reject' }, { status: 400 });
  }

  const guard = await guardRelease(params.id);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { admin, release } = guard;

  if (!release.pending_rewrite_content) {
    return NextResponse.json({ error: 'No pending rewrite to act on' }, { status: 409 });
  }

  const updates: Record<string, any> =
    parsed.data.decision === 'accept'
      ? { admin_refined_content: release.pending_rewrite_content, pending_rewrite_content: null }
      : { pending_rewrite_content: null };

  const { error } = await admin
    .from('release_requests')
    .update(updates)
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: `Failed to save: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
