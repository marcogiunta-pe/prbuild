// app/api/ai/rewrite-from-panel/route.ts
import 'openai/shims/web';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { PanelFeedback } from '@/types';
import { getRewritePrompts } from '@/lib/prompts';
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

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user, supabase } = auth;

    const body = await request.json().catch(() => ({}));
    const parsed_body = RequestSchema.safeParse(body);
    if (!parsed_body.success) {
      return NextResponse.json({ error: parsed_body.error.errors[0].message }, { status: 400 });
    }
    const { releaseRequestId } = parsed_body.data;

    // Fetch the release request
    const { data: release, error } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', releaseRequestId)
      .single();

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // Check access - must be the client who owns this or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profile?.role !== 'admin' && release.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Need draft and panel feedback
    const currentDraft = release.admin_refined_content || release.ai_draft_content;
    const panelFeedback = release.panel_individual_feedback as PanelFeedback[] | null;

    if (!currentDraft) {
      return NextResponse.json({ error: 'No draft to rewrite' }, { status: 400 });
    }

    if (!panelFeedback || panelFeedback.length === 0) {
      return NextResponse.json({ error: 'No panel feedback available' }, { status: 400 });
    }

    // Format feedback for the prompt
    const feedbackSummary = panelFeedback.map(f => 
      `- ${f.persona} (${f.role}): ${f.compelling ? 'Found compelling' : 'Not compelling'}. ${f.feedback}${f.missing ? ` Missing: ${f.missing}` : ''}`
    ).join('\n');

    const synthesis = release.panel_synthesis || '';

    // Get prompts (from database or fallback to defaults)
    const { systemPrompt, userPrompt } = await getRewritePrompts({
      originalDraft: currentDraft,
      panelSynthesis: synthesis,
      keyIssues: feedbackSummary,
    });

    // Call OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const rewrittenContent = completion.choices[0].message.content || '';

    // Save rewrite as the refined content. Clear the stale panel review —
    // the old score was computed against the pre-rewrite draft, so showing
    // it on the rewritten draft is misleading. Clearing re-enables the
    // "Request Journalist Review" CTA so the user can re-run the panel
    // on the new draft and get a fresh score.
    const adminClient = createAdminClient();
    const { error: updateError } = await adminClient
      .from('release_requests')
      .update({
        admin_refined_content: rewrittenContent,
        panel_individual_feedback: null,
        panel_synthesis: null,
        panel_contrarian_recommendation: null,
        panel_reviewed_at: null,
        status: 'draft_generated',
        admin_notes: (release.admin_notes || '') + `\n[${new Date().toISOString()}] Rewrite based on panel feedback requested by ${profile?.role === 'admin' ? 'admin' : 'client'}. Prior panel review cleared — re-run required.`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: `Failed to save rewritten draft: ${updateError.message}` }, { status: 500 });
    }

    // Log activity
    await adminClient.from('activity_log').insert({
      release_request_id: releaseRequestId,
      user_id: user.id,
      action: 'ai_rewrite_from_panel',
      details: { model: 'gpt-4o', requestedBy: profile?.role },
    });

    return NextResponse.json({
      success: true,
      content: rewrittenContent,
    });
  } catch (error) {
    console.error('AI rewrite error:', error);
    return NextResponse.json(
      { error: 'Failed to rewrite draft' },
      { status: 500 }
    );
  }
}
