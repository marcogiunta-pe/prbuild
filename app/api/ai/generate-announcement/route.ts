// app/api/ai/generate-announcement/route.ts
import 'openai/shims/web';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const RequestSchema = z.object({
  releaseRequestId: z.string().uuid(),
});

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    fetch: globalThis.fetch,
    timeout: 30_000,
    maxRetries: 1,
  });
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { releaseRequestId } = parsed.data;

    const { supabase } = auth;
    const { data: release, error } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', releaseRequestId)
      .single();

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    const content = release.client_edited_content || release.admin_refined_content || release.ai_draft_content || '';
    const headline = release.ai_selected_headline || release.news_hook || 'Press Release';
    const companyName = release.company_name || '';
    const industry = release.industry || 'general';

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You generate announcement content for a company that just published a press release.
Return ONLY a JSON object with these fields:
- clientEmail: { subject, body } — A professional email to send to clients, partners, investors, and stakeholders announcing the news. Tone: warm, confident, informative. 3-4 paragraphs. Include a link placeholder [LINK_TO_RELEASE].
- linkedInPost: string — A LinkedIn post (max 280 words) to share the news with followers. Professional but engaging. Include relevant hashtags. Use line breaks for readability. Do not use emojis.

No markdown fences. Return raw JSON only.`,
        },
        {
          role: 'user',
          content: `Company: ${companyName}
Industry: ${industry}
Headline: ${headline}
Press Release Content:
${content.substring(0, 3000)}

Generate the client announcement email and LinkedIn post.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0].message.content || '{}';

    let result: {
      clientEmail?: { subject: string; body: string };
      linkedInPost?: string;
    };
    try {
      const cleaned = aiResponse.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse announcement response:', aiResponse);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Save to the release record
    const adminSupabase = createAdminClient();
    await adminSupabase
      .from('release_requests')
      .update({
        announcement_content: result,
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Announcement generation error:', error);
    return NextResponse.json({ error: 'Failed to generate announcements' }, { status: 500 });
  }
}
