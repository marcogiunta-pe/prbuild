// app/api/releases/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

// GET - List releases for current user
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user, supabase } = auth;

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
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user } = auth;
    const admin = createAdminClient();

    const body = await request.json();

    // Authoritative entitlement check. The client cannot supply amount_paid,
    // stripe_payment_id, status, or client_id — all are set server-side.
    const { data: profile } = await admin
      .from('profiles')
      .select('role, subscription_status, free_releases_remaining')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const isAdmin = profile.role === 'admin';
    const hasActiveSubscription = profile.subscription_status === 'active';
    const mustSpendCredit = !isAdmin && !hasActiveSubscription;

    const { data: release, error } = await admin
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
        supporting_context: body.supportingContext,
        plan: body.plan,
        // Billing is enforced server-side. During beta all releases are free;
        // never trust a client-supplied amount or Stripe id.
        amount_paid: 0,
        stripe_payment_id: null,
        status: 'submitted',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating release:', error);
      return NextResponse.json({ error: 'Failed to create release' }, { status: 500 });
    }

    // Atomically spend one free credit. Roll back the insert if none remain so
    // an out-of-credit user can never leave a row behind.
    if (mustSpendCredit) {
      const { data: remaining, error: spendErr } = await admin.rpc('spend_free_release', {
        p_user: user.id,
      });
      if (spendErr || remaining === -2) {
        await admin.from('release_requests').delete().eq('id', release.id);
        return NextResponse.json(
          { error: 'No releases remaining. Please upgrade your plan.' },
          { status: 402 }
        );
      }
    }

    // Log activity
    await admin.from('activity_log').insert({
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
