// app/api/ai/apply-suggestion/route.ts
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
  suggestion: z.string().min(1, 'Suggestion is required'),
  persona: z.string().optional(),
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
    const { user, supabase } = auth;

    const body = await request.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { releaseRequestId, suggestion, persona } = parsed.data;

    const { data: release, error } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', releaseRequestId)
      .single();

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    const currentDraft = release.client_edited_content || release.admin_refined_content || release.ai_draft_content;
    if (!currentDraft) {
      return NextResponse.json({ error: 'No draft to modify' }, { status: 400 });
    }

    const headline = release.ai_selected_headline || '';

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a press release editor. Your job is to apply ONE specific suggestion to a press release draft.

Rules:
1. Return the COMPLETE press release from start to finish. Every paragraph, every quote, every section.
2. Change ONLY what the suggestion asks for. Everything else must remain word-for-word identical.
3. Do NOT add a headline or dateline at the top. The body starts with the first paragraph of content.
4. Do NOT summarize or shorten. The output must be the same length as the input (plus/minus the specific change).
5. If the suggestion asks to change the call to action, change ONLY the call to action. Leave all other paragraphs untouched.`,
        },
        {
          role: 'user',
          content: `CURRENT HEADLINE (do not include this in your output): ${headline}

CURRENT DRAFT (return this in full with only the suggested change applied):
${currentDraft}

SUGGESTION TO APPLY${persona ? ` (from ${persona})` : ''}:
${suggestion}

Return the COMPLETE updated press release. Every paragraph must be present. Only modify what the suggestion asks for.`,
        },
      ],
      temperature: 0.2,
      max_tokens: 4500,
    });

    const updatedContent = completion.choices[0].message.content || '';

    // Save as pending rewrite so the user can compare and accept/reject
    const adminClient = createAdminClient();
    const { error: updateError } = await adminClient
      .from('release_requests')
      .update({
        pending_rewrite_content: updatedContent,
        admin_notes: (release.admin_notes || '') + `\n[${new Date().toISOString()}] Applied suggestion from ${persona || 'reviewer'}: "${suggestion.substring(0, 100)}..."`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    await adminClient.from('activity_log').insert({
      release_request_id: releaseRequestId,
      user_id: user.id,
      action: 'applied_reviewer_suggestion',
      details: { persona, suggestion: suggestion.substring(0, 200) },
    });

    return NextResponse.json({ success: true, content: updatedContent });
  } catch (error) {
    console.error('Apply suggestion error:', error);
    return NextResponse.json({ error: 'Failed to apply suggestion' }, { status: 500 });
  }
}
