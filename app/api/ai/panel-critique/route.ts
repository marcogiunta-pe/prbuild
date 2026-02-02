// app/api/ai/panel-critique/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { 
  buildIndustryPanelPrompt, 
  parsePanelCritiqueResponse,
} from '@/lib/prompts/panel-critique';
import { getPanelCritiquePrompts } from '@/lib/prompts';

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

    const { releaseRequestId } = await request.json();

    // Fetch the release request
    const { data: release, error } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', releaseRequestId)
      .single();

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // Need to have a draft first
    const draftContent = release.admin_refined_content || release.ai_draft_content;
    if (!draftContent) {
      return NextResponse.json({ error: 'No draft content to critique' }, { status: 400 });
    }

    // Build the full press release text for critique
    const headline = release.ai_selected_headline || release.ai_headline_options?.[0] || '';
    const subhead = release.ai_subhead || '';
    const fullRelease = `
HEADLINE: ${headline}
${subhead ? `SUBHEAD: ${subhead}` : ''}

${draftContent}
`.trim();

    // Get prompts - try database first, then use industry-specific fallback
    const { systemPrompt: dbSystemPrompt, userPrompt } = await getPanelCritiquePrompts(fullRelease);
    
    // Use industry-specific prompt if available and no custom DB prompt
    const industry = release.industry || 'general';
    const systemPrompt = dbSystemPrompt || buildIndustryPanelPrompt(industry as any);

    // Call OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const aiResponse = completion.choices[0].message.content || '';

    // Parse the response
    const parsed = parsePanelCritiqueResponse(aiResponse);

    // Update the release request with panel critique
    const { error: updateError } = await supabase
      .from('release_requests')
      .update({
        panel_critique_raw: { raw: aiResponse, parsed },
        panel_individual_feedback: parsed.individualFeedback,
        panel_synthesis: parsed.synthesis || parsed.themes.join('; '),
        panel_contrarian_recommendation: parsed.contrarianRecommendation,
        panel_reviewed_at: new Date().toISOString(),
        status: 'panel_reviewed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to save critique' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      release_request_id: releaseRequestId,
      user_id: user.id,
      action: 'panel_critique_generated',
      details: { 
        model: 'gpt-4-turbo-preview',
        industry,
        feedbackCount: parsed.individualFeedback.length,
      },
    });

    return NextResponse.json({
      success: true,
      critique: parsed,
      raw: aiResponse,
    });
  } catch (error) {
    console.error('Panel critique error:', error);
    return NextResponse.json(
      { error: 'Failed to generate panel critique' },
      { status: 500 }
    );
  }
}
