// app/api/releases/[id]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Publish a release to the showcase
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    // Get the release
    const { data: release, error: fetchError } = await supabase
      .from('release_requests')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // Check if already published
    const { data: existingShowcase } = await supabase
      .from('showcase_releases')
      .select('id')
      .eq('release_request_id', params.id)
      .single();

    if (existingShowcase) {
      return NextResponse.json({ error: 'Release already published' }, { status: 409 });
    }

    // Create summary from content (first 200 chars)
    const content = release.admin_refined_content || release.ai_draft_content || '';
    const summary = content.substring(0, 200).trim() + (content.length > 200 ? '...' : '');

    // Create showcase entry
    const { data: showcase, error: insertError } = await supabase
      .from('showcase_releases')
      .insert({
        release_request_id: release.id,
        headline: release.ai_selected_headline || release.ai_headline_options?.[0] || release.news_hook,
        subhead: release.ai_subhead,
        company_name: release.company_name,
        summary,
        full_content: content,
        category: release.category || 'Other',
        industry: release.industry,
        tags: release.tags,
        contact_name: release.media_contact_name,
        contact_email: release.media_contact_email,
        contact_phone: release.media_contact_phone,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error publishing to showcase:', insertError);
      return NextResponse.json({ error: 'Failed to publish release' }, { status: 500 });
    }

    // Update release status
    await supabase
      .from('release_requests')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    // Log activity
    await supabase.from('activity_log').insert({
      release_request_id: params.id,
      user_id: user.id,
      action: 'release_published',
      details: { showcaseId: showcase.id },
    });

    return NextResponse.json({ 
      success: true,
      showcase,
    });
  } catch (error) {
    console.error('Error publishing release:', error);
    return NextResponse.json({ error: 'Failed to publish release' }, { status: 500 });
  }
}
