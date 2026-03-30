// app/api/ai/generate-pitches/route.ts
import 'openai/shims/web';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const RequestSchema = z.object({
  releaseRequestId: z.string().uuid('Invalid release request ID'),
});

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    fetch: globalThis.fetch,
    timeout: 30_000,
    maxRetries: 1,
  });
}

const REPORTER_PROFILES = [
  { reporterName: 'Sarah Chen', outlet: 'TechCrunch', beat: 'startups and emerging technology' },
  { reporterName: 'Michael Torres', outlet: 'Bloomberg', beat: 'business and finance' },
  { reporterName: 'Priya Sharma', outlet: 'Industry Dive', beat: 'industry-specific trade coverage' },
  { reporterName: 'James O\'Brien', outlet: 'Local Business Journal', beat: 'local business and economic development' },
  { reporterName: 'Rachel Kim', outlet: 'Associated Press', beat: 'general news and trending stories' },
];

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { releaseRequestId } = parsed.data;

    // Fetch the release request using the user's client (respects RLS)
    const { supabase } = auth;
    const { data: release, error } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', releaseRequestId)
      .single();

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // Build the press release summary for the prompt
    const content = release.client_edited_content || release.admin_refined_content || release.ai_draft_content || '';
    const headline = release.ai_selected_headline || release.news_hook || 'Press Release';
    const companyName = release.company_name || '';
    const industry = release.industry || 'general';

    const reporterList = REPORTER_PROFILES.map(
      (r, i) => `${i + 1}. ${r.reporterName} at ${r.outlet} — covers ${r.beat}`
    ).join('\n');

    const systemPrompt = `You are a PR professional writing personalized journalist pitch emails.
Each pitch should feel like it was written specifically for that reporter.
Use the reporter's first name. Reference their recent beat coverage.
Keep it to 3-5 sentences. Include a clear subject line.
Tone: professional, direct, not salesy. Journalists hate being pitched — make this worth their time.
Output as JSON array with fields: reporterName, outlet, beat, subject, body`;

    const userPrompt = `Write 5 personalized journalist pitch emails for the following press release.

Company: ${companyName}
Industry: ${industry}
Headline: ${headline}
Press Release Content:
${content.substring(0, 3000)}

Target reporters:
${reporterList}

For each reporter, write a pitch that connects the news to their specific beat. The pitch should explain why their audience would care about this story.

Return ONLY a JSON array — no markdown fences, no extra text. Each object must have: reporterName, outlet, beat, subject, body`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    });

    const aiResponse = completion.choices[0].message.content || '[]';

    // Parse the JSON response — strip markdown fences if present
    let pitches: Array<{
      reporterName: string;
      outlet: string;
      beat: string;
      subject: string;
      body: string;
    }>;
    try {
      const cleaned = aiResponse.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      pitches = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse pitch response:', aiResponse);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Save pitches using admin client to bypass RLS (field may not exist in strict schema)
    const adminSupabase = createAdminClient();
    const { error: updateError } = await adminSupabase
      .from('release_requests')
      .update({
        pitch_emails: pitches,
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (updateError) {
      console.error('Failed to save pitches:', updateError);
      return NextResponse.json({ error: 'Failed to save pitch emails' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      pitches,
    });
  } catch (error: unknown) {
    console.error('Pitch generation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate pitches: ${message}` },
      { status: 500 }
    );
  }
}
