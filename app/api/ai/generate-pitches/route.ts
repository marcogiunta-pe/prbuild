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

// Industry-specific real journalist profiles
const REPORTER_PROFILES_BY_INDUSTRY: Record<string, typeof DEFAULT_REPORTER_PROFILES> = {
  technology: [
    { reporterName: 'Connie Loizos', outlet: 'TechCrunch', beat: 'venture capital and startups' },
    { reporterName: 'Erin Griffith', outlet: 'The New York Times', beat: 'Silicon Valley and startup culture' },
    { reporterName: 'Tom Dotan', outlet: 'The Wall Street Journal', beat: 'enterprise technology and AI' },
    { reporterName: 'Zoë Schiffer', outlet: 'Platformer', beat: 'tech industry and workplace' },
    { reporterName: 'Kia Kokalitcheva', outlet: 'Axios', beat: 'venture capital and tech deals' },
  ],
  healthcare: [
    { reporterName: 'Christina Farr', outlet: 'CNBC', beat: 'health tech and digital health' },
    { reporterName: 'Casey Ross', outlet: 'STAT News', beat: 'health technology and AI in medicine' },
    { reporterName: 'Tina Reed', outlet: 'Axios', beat: 'healthcare industry and policy' },
    { reporterName: 'Arthur Allen', outlet: 'Politico', beat: 'health IT and policy' },
    { reporterName: 'Rebecca Pifer', outlet: 'Healthcare Dive', beat: 'hospital operations and health systems' },
  ],
  finance: [
    { reporterName: 'Ryan Browne', outlet: 'CNBC', beat: 'fintech and digital finance' },
    { reporterName: 'Penny Crosman', outlet: 'American Banker', beat: 'banking technology and innovation' },
    { reporterName: 'Sujata Rao', outlet: 'Reuters', beat: 'financial markets and fintech' },
    { reporterName: 'Mary Ann Azevedo', outlet: 'TechCrunch', beat: 'fintech startups and funding' },
    { reporterName: 'Tanaya Macheel', outlet: 'Fortune', beat: 'fintech and crypto' },
  ],
  retail: [
    { reporterName: 'Melissa Repko', outlet: 'CNBC', beat: 'retail industry and consumer trends' },
    { reporterName: 'Suzanne Kapner', outlet: 'The Wall Street Journal', beat: 'retail and department stores' },
    { reporterName: 'Leticia Miranda', outlet: 'NBC News', beat: 'retail and e-commerce' },
    { reporterName: 'Daphne Howland', outlet: 'Retail Dive', beat: 'retail strategy and operations' },
    { reporterName: 'Adrianne Pasquarelli', outlet: 'Ad Age', beat: 'retail marketing and brands' },
  ],
};

const DEFAULT_REPORTER_PROFILES = [
  { reporterName: 'Kia Kokalitcheva', outlet: 'Axios', beat: 'venture capital and tech deals' },
  { reporterName: 'Erin Griffith', outlet: 'The New York Times', beat: 'startups and venture capital' },
  { reporterName: 'Rolfe Winkler', outlet: 'The Wall Street Journal', beat: 'technology and business' },
  { reporterName: 'Kate Clark', outlet: 'The Information', beat: 'venture capital and startups' },
  { reporterName: 'Aisha Counts', outlet: 'Bloomberg', beat: 'business and finance' },
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

    const reporters = REPORTER_PROFILES_BY_INDUSTRY[industry] || DEFAULT_REPORTER_PROFILES;
    const reporterList = reporters.map(
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
