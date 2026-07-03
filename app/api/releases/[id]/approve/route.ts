// app/api/releases/[id]/approve/route.ts
// Client approves the current draft. final_content is computed server-side from
// the stored content (never trusted from the request body). Optional digital
// signature is appended to admin_notes, preserving prior preview-page behavior.
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardRelease, CLIENT_REVIEW_STATES } from '@/lib/release-auth';

const Schema = z.object({
  signature: z
    .object({
      name: z.string().trim().min(1),
      email: z.string().trim().email(),
      phone: z.string().trim().min(1),
    })
    .optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const guard = await guardRelease(params.id);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { admin, release } = guard;

  if (!CLIENT_REVIEW_STATES.includes(release.status)) {
    return NextResponse.json(
      { error: `Cannot approve from status "${release.status}"` },
      { status: 409 }
    );
  }

  // Compute final content from stored fields — do not trust the client.
  const finalContent =
    release.client_edited_content ||
    release.admin_refined_content ||
    release.ai_draft_content ||
    '';

  const updates: Record<string, any> = {
    status: 'client_approved',
    final_content: finalContent,
    final_approved_at: new Date().toISOString(),
  };

  if (parsed.data.signature) {
    const { name, email, phone } = parsed.data.signature;
    const stamp = `[${new Date().toISOString()}] Publication authorized by: ${name} (${email}, ${phone}). Digital signature on file.`;
    updates.admin_notes = release.admin_notes ? `${release.admin_notes}\n${stamp}` : stamp;
  }

  // Re-assert the status in the UPDATE itself so a concurrent approve/feedback
  // that already moved the row can't be clobbered (read-then-write race).
  const { data: updated, error } = await admin
    .from('release_requests')
    .update(updates)
    .eq('id', params.id)
    .in('status', CLIENT_REVIEW_STATES)
    .select('id');

  if (error) {
    return NextResponse.json({ error: `Failed to approve: ${error.message}` }, { status: 500 });
  }
  if (!updated || updated.length === 0) {
    return NextResponse.json({ error: 'Release status changed — please reload' }, { status: 409 });
  }

  return NextResponse.json({ success: true });
}
