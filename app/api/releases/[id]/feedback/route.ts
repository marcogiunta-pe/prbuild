// app/api/releases/[id]/feedback/route.ts
// Client submits revision feedback on a draft. Replaces the former browser
// write to release_requests (status -> client_feedback).
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardRelease, CLIENT_REVIEW_STATES } from '@/lib/release-auth';

const Schema = z.object({ feedback: z.string().trim().min(1).max(10000) });

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Feedback is required' }, { status: 400 });
  }

  const guard = await guardRelease(params.id);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { admin, release } = guard;

  if (!CLIENT_REVIEW_STATES.includes(release.status)) {
    return NextResponse.json(
      { error: `Cannot submit feedback from status "${release.status}"` },
      { status: 409 }
    );
  }

  // Guard the UPDATE with the same status predicate to avoid clobbering a row
  // a concurrent approve already advanced (read-then-write race).
  const { data: updated, error } = await admin
    .from('release_requests')
    .update({
      client_feedback: parsed.data.feedback,
      client_feedback_at: new Date().toISOString(),
      status: 'client_feedback',
    })
    .eq('id', params.id)
    .in('status', CLIENT_REVIEW_STATES)
    .select('id');

  if (error) {
    return NextResponse.json({ error: `Failed to save feedback: ${error.message}` }, { status: 500 });
  }
  if (!updated || updated.length === 0) {
    return NextResponse.json({ error: 'Release status changed — please reload' }, { status: 409 });
  }

  return NextResponse.json({ success: true });
}
