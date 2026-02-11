// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNewsletterEmail } from '@/lib/email';

// GET - List newsletter sends (admin only)
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

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { data: newsletters, error } = await supabase
      .from('newsletter_sends')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching newsletters:', error);
      return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
    }

    return NextResponse.json({ newsletters });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
  }
}

// POST - Send a newsletter (admin only)
export async function POST(request: NextRequest) {
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

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();
    
    if (!body.subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    // Get journalists matching the category filter
    let journalistQuery = supabase
      .from('journalist_subscribers')
      .select('*')
      .eq('is_verified', true);

    if (body.category) {
      journalistQuery = journalistQuery.contains('categories', [body.category]);
    }

    const { data: journalists } = await journalistQuery;
    const recipientCount = journalists?.length || 0;

    // Get recent showcase releases for the newsletter
    let releaseQuery = supabase
      .from('showcase_releases')
      .select('id, headline, subhead, company_name, summary, category')
      .order('published_at', { ascending: false })
      .limit(10);

    if (body.category) {
      releaseQuery = releaseQuery.eq('category', body.category);
    }

    const { data: releases } = await releaseQuery;

    // Send emails to all verified journalists
    let sentCount = 0;
    let failedCount = 0;

    for (const journalist of journalists || []) {
      try {
        await sendNewsletterEmail(
          journalist.email,
          body.subject,
          releases || [],
          journalist.unsubscribe_token
        );
        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send to ${journalist.email}:`, emailError);
        failedCount++;
      }
    }

    // Log the newsletter send
    const { data: newsletter, error } = await supabase
      .from('newsletter_sends')
      .insert({
        subject: body.subject,
        category: body.category || null,
        release_ids: releases?.map(r => r.id) || null,
        recipient_count: recipientCount,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging newsletter send:', error);
      return NextResponse.json({ error: 'Failed to log newsletter send' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      newsletter,
      recipientCount,
      sentCount,
      failedCount,
      message: `Newsletter sent to ${sentCount} recipients${failedCount > 0 ? ` (${failedCount} failed)` : ''}`,
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}
