// app/api/ai/generate-draft/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { parsePRDraftResponse } from '@/lib/prompts/pr-generation';
import { getPRGenerationPrompts } from '@/lib/prompts';

const RequestSchema = z.object({
  releaseRequestId: z.string().uuid('Invalid release request ID'),
});

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check admin auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

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

    // Format the release date
    const releaseDate = new Date(release.release_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Get prompts (from database or fallback to defaults)
    const { systemPrompt, userPrompt } = await getPRGenerationPrompts({
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

    // Call OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const aiResponse = completion.choices[0].message.content || '';

    // Parse the response
    const parsed = parsePRDraftResponse(aiResponse);

    // Update the release request with AI draft
    const { error: updateError } = await supabase
      .from('release_requests')
      .update({
        ai_draft_raw: { raw: aiResponse, parsed },
        ai_headline_options: parsed.headlines,
        ai_subhead: parsed.subhead,
        ai_draft_content: parsed.fullContent,
        ai_visuals_suggestions: parsed.visuals,
        ai_distribution_checklist: parsed.checklist,
        ai_generated_at: new Date().toISOString(),
        status: 'draft_generated',
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      release_request_id: releaseRequestId,
      user_id: user.id,
      action: 'ai_draft_generated',
      details: { model: 'gpt-4-turbo-preview' },
    });

    return NextResponse.json({
      success: true,
      draft: parsed,
      raw: aiResponse,
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate draft' },
      { status: 500 }
    );
  }
}
