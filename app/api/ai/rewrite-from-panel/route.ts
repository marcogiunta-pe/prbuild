// app/api/ai/rewrite-from-panel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { PanelFeedback } from '@/types';
import { getRewritePrompts } from '@/lib/prompts';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check auth - can be client or admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Check if rewrite was already used
    if (release.rewrite_used) {
      return NextResponse.json({ error: 'Rewrite has already been used for this release' }, { status: 400 });
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
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const rewrittenContent = completion.choices[0].message.content || '';

    // Save as pending rewrite and mark rewrite as used
    const { error: updateError } = await supabase
      .from('release_requests')
      .update({
        pending_rewrite_content: rewrittenContent,
        rewrite_used: true,
        admin_notes: (release.admin_notes || '') + `\n[${new Date().toISOString()}] Rewrite based on panel feedback requested by ${profile?.role === 'admin' ? 'admin' : 'client'}.`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', releaseRequestId);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to save rewritten draft' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      release_request_id: releaseRequestId,
      user_id: user.id,
      action: 'ai_rewrite_from_panel',
      details: { model: 'gpt-4-turbo-preview', requestedBy: profile?.role },
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
