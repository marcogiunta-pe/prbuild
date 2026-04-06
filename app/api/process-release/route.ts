// app/api/process-release/route.ts
// Automated pipeline: generate draft -> panel critique -> send to client
// Called programmatically after submission — no user auth required, uses API key.
import 'openai/shims/web';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { parsePRDraftResponse } from '@/lib/prompts/pr-generation';
import { getPRGenerationPrompts, getPanelCritiquePrompts } from '@/lib/prompts';
import {
  buildIndustryPanelPrompt,
  parsePanelCritiqueResponse,
} from '@/lib/prompts/panel-critique';
import { createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 120;

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
    // API key check
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.PROCESS_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed_body = RequestSchema.safeParse(body);
    if (!parsed_body.success) {
      return NextResponse.json({ error: parsed_body.error.errors[0].message }, { status: 400 });
    }
    const { releaseRequestId } = parsed_body.data;

    // Use admin client (service role) to bypass RLS
    const supabase = createAdminClient();

    // Fetch the release request
    const { data: release, error } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', releaseRequestId)
      .single();

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // -------------------------------------------------------
    // STEP 1: Generate Draft
    // -------------------------------------------------------
    const releaseDate = new Date(release.release_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const { systemPrompt: genSystemPrompt, userPrompt: genUserPrompt } = await getPRGenerationPrompts({
      companyName: release.company_name,
      companyWebsite: release.company_website,
      announcementType: release.announcement_type,
      newsHook: release.news_hook,
      dateline: release.dateline_city,
      releaseDate,
      coreFacts: release.core_facts || [],
      quoteSources: release.quote_sources,
      boilerplate: release.boilerplate,
      companyFacts: release.company_facts,
      mediaContact: {
        name: release.media_contact_name,
        title: release.media_contact_title,
        phone: release.media_contact_phone,
        email: release.media_contact_email,
        website: release.company_website,
      },
      visuals: release.visuals_description,
      desiredCTA: release.desired_cta,
      supportingContext: release.supporting_context,
    });

    const openai = getOpenAIClient();

    let draftCompletion;
    try {
      draftCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: genSystemPrompt },
          { role: 'user', content: genUserPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      });
    } catch (draftErr: any) {
      console.error('Draft generation failed:', draftErr);
      // Update status to reflect failure
      await supabase
        .from('release_requests')
        .update({
          status: 'submitted',
          admin_notes: `Auto-draft failed: ${draftErr?.message || 'Unknown error'}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', releaseRequestId);

      return NextResponse.json({ error: 'Draft generation failed', stage: 'draft' }, { status: 500 });
    }

    const draftAiResponse = draftCompletion.choices[0].message.content || '';
    const parsedDraft = parsePRDraftResponse(draftAiResponse);

    // Save draft
    const { error: draftUpdateError } = await supabase
      .from('release_requests')
      .update({
        ai_draft_raw: { raw: draftAiResponse, parsed: parsedDraft },
        ai_headline_options: parsedDraft.headlines,
        ai_subhead: parsedDraft.subhead,
        ai_draft_content: parsedDraft.fullContent,
        ai_visuals_suggestions: parsedDraft.visuals,
        ai_distribution_checklist: parsedDraft.checklist,
        ai_generated_at: new Date().toISOString(),
        status: 'draft_generated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (draftUpdateError) {
      console.error('Draft update error:', draftUpdateError);
      return NextResponse.json({ error: 'Failed to save draft', stage: 'draft' }, { status: 500 });
    }

    // Log draft activity
    await supabase.from('activity_log').insert({
      release_request_id: releaseRequestId,
      user_id: release.client_id,
      action: 'ai_draft_generated',
      details: { model: 'gpt-4o', automated: true },
    });

    // -------------------------------------------------------
    // STEP 2: Panel Critique
    // -------------------------------------------------------
    const draftContent = parsedDraft.fullContent;
    if (!draftContent) {
      console.error('No draft content produced for panel critique');
      return NextResponse.json({ error: 'No draft content for panel critique', stage: 'panel' }, { status: 500 });
    }

    const headline = parsedDraft.headlines?.[0] || '';
    const subhead = parsedDraft.subhead || '';
    const fullRelease = `
HEADLINE: ${headline}
${subhead ? `SUBHEAD: ${subhead}` : ''}

${draftContent}
`.trim();

    const { systemPrompt: dbPanelSystemPrompt, userPrompt: panelUserPrompt } = await getPanelCritiquePrompts(fullRelease);
    const industry = release.industry || 'general';
    const panelSystemPrompt = dbPanelSystemPrompt || buildIndustryPanelPrompt(industry as any);

    let panelCompletion;
    try {
      panelCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: panelSystemPrompt },
          { role: 'user', content: panelUserPrompt },
        ],
        temperature: 0.8,
        max_tokens: 8000,
      });
    } catch (panelErr: any) {
      console.error('Panel critique failed:', panelErr);
      // Draft was saved — update notes but keep draft_generated status
      await supabase
        .from('release_requests')
        .update({
          admin_notes: `Auto-panel failed: ${panelErr?.message || 'Unknown error'}. Draft was generated successfully.`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', releaseRequestId);

      return NextResponse.json({ error: 'Panel critique failed', stage: 'panel' }, { status: 500 });
    }

    const panelAiResponse = panelCompletion.choices[0].message.content || '';
    const parsedPanel = parsePanelCritiqueResponse(panelAiResponse);

    // Save panel critique
    const { error: panelUpdateError } = await supabase
      .from('release_requests')
      .update({
        panel_critique_raw: { raw: panelAiResponse, parsed: parsedPanel },
        panel_individual_feedback: parsedPanel.individualFeedback,
        panel_synthesis: parsedPanel.synthesis || parsedPanel.themes.join('; '),
        panel_contrarian_recommendation: parsedPanel.contrarianRecommendation,
        panel_reviewed_at: new Date().toISOString(),
        status: 'panel_reviewed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (panelUpdateError) {
      console.error('Panel update error:', panelUpdateError);
      return NextResponse.json({ error: 'Failed to save critique', stage: 'panel' }, { status: 500 });
    }

    // Log panel activity
    await supabase.from('activity_log').insert({
      release_request_id: releaseRequestId,
      user_id: release.client_id,
      action: 'panel_critique_generated',
      details: {
        model: 'gpt-4o',
        industry,
        feedbackCount: parsedPanel.individualFeedback.length,
        automated: true,
      },
    });

    // -------------------------------------------------------
    // STEP 3: Move to awaiting_client (sent to client)
    // -------------------------------------------------------
    const { error: sendError } = await supabase
      .from('release_requests')
      .update({
        status: 'awaiting_client',
        sent_to_client_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (sendError) {
      console.error('Send to client error:', sendError);
      return NextResponse.json({ error: 'Failed to update status to awaiting_client', stage: 'send' }, { status: 500 });
    }

    // Log send activity
    await supabase.from('activity_log').insert({
      release_request_id: releaseRequestId,
      user_id: release.client_id,
      action: 'sent_to_client',
      details: { automated: true },
    });

    return NextResponse.json({
      success: true,
      stages: {
        draft: 'completed',
        panel: 'completed',
        sent: 'completed',
      },
    });
  } catch (error: any) {
    console.error('Process release error:', error);
    return NextResponse.json(
      { error: `Pipeline failed: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
