// app/api/releases/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List releases for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Select only the columns needed for the list view (avoids transferring large JSONB fields)
    let query = supabase.from('release_requests').select(
      'id, client_id, company_name, company_website, announcement_type, news_hook, industry, plan, amount_paid, status, ai_selected_headline, ai_subhead, created_at, updated_at, sent_to_client_at, published_at'
    );

    // If not admin, only show own releases
    if (profile?.role !== 'admin') {
      query = query.eq('client_id', user.id);
    }

    const { data: releases, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error querying releases:', error);
      return NextResponse.json({ error: 'Failed to fetch releases' }, { status: 500 });
    }

    return NextResponse.json({ releases });
  } catch (error) {
    console.error('Error fetching releases:', error);
    return NextResponse.json({ error: 'Failed to fetch releases' }, { status: 500 });
  }
}

// POST - Create a new release request
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data: release, error } = await supabase
      .from('release_requests')
      .insert({
        client_id: user.id,
        company_name: body.companyName,
        company_website: body.companyWebsite,
        announcement_type: body.announcementType,
        news_hook: body.newsHook,
        dateline_city: body.datelineCity,
        release_date: body.releaseDate,
        core_facts: body.coreFacts,
        quote_sources: body.quoteSources,
        boilerplate: body.boilerplate,
        company_facts: body.companyFacts,
        media_contact_name: body.mediaContactName,
        media_contact_title: body.mediaContactTitle,
        media_contact_email: body.mediaContactEmail,
        media_contact_phone: body.mediaContactPhone,
        visuals_description: body.visualsDescription,
        desired_cta: body.desiredCta,
        industry: body.industry,
        plan: body.plan,
        amount_paid: body.amountPaid,
        stripe_payment_id: body.stripePaymentId,
        status: 'submitted',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating release:', error);
      return NextResponse.json({ error: 'Failed to create release' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      release_request_id: release.id,
      user_id: user.id,
      action: 'release_submitted',
      details: { plan: body.plan },
    });

    return NextResponse.json({ release });
  } catch (error) {
    console.error('Error creating release:', error);
    return NextResponse.json({ error: 'Failed to create release' }, { status: 500 });
  }
}
