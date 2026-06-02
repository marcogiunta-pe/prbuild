// app/api/releases/[id]/select-headline/route.ts
// Client picks one of the AI-generated headline options. The chosen headline
// must be a member of the stored ai_headline_options array — clients cannot
// write arbitrary text into ai_selected_headline.
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardRelease } from '@/lib/release-auth';

const Schema = z.object({ headline: z.string().trim().min(1) });

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'headline is required' }, { status: 400 });
  }

  const guard = await guardRelease(params.id);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { admin, release } = guard;

  const options = Array.isArray(release.ai_headline_options)
    ? (release.ai_headline_options as string[])
    : [];
  if (!options.includes(parsed.data.headline)) {
    return NextResponse.json({ error: 'Headline is not one of the available options' }, { status: 400 });
  }

  const { error } = await admin
    .from('release_requests')
    .update({ ai_selected_headline: parsed.data.headline })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: `Failed to select headline: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
