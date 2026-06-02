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

  const { error } = await admin
    .from('release_requests')
    .update(updates)
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: `Failed to approve: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
