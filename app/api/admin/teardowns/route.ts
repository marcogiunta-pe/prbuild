import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { sendTeardownEmail } from '@/lib/email';

// GET - List past teardown sends
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { data: teardowns, error } = await auth.supabase
      .from('teardown_sends')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching teardowns:', error);
      return NextResponse.json({ error: 'Failed to fetch teardowns' }, { status: 500 });
    }

    return NextResponse.json({ teardowns });
  } catch (error) {
    console.error('Error fetching teardowns:', error);
    return NextResponse.json({ error: 'Failed to fetch teardowns' }, { status: 500 });
  }
}

// POST - Send a teardown email to all subscribed leads
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.subject || !body.prCompany || !body.prHeadline || !body.teardownContent) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Fetch all subscribed leads
    const { data: leads, error: leadsError } = await supabase
      .from('email_leads')
      .select('email, unsubscribe_token')
      .eq('subscribed_teardown', true);

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ error: 'No subscribed leads to send to' }, { status: 400 });
    }

    // Send emails (in sequence to respect rate limits)
    let sentCount = 0;
    for (const lead of leads) {
      try {
        await sendTeardownEmail(
          lead.email,
          body.subject,
          body.prCompany,
          body.prHeadline,
          body.teardownContent,
          lead.unsubscribe_token
        );
        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send teardown to ${lead.email}:`, emailError);
      }
    }

    // Log the send
    const { error: logError } = await supabase
      .from('teardown_sends')
      .insert({
        subject: body.subject,
        pr_company: body.prCompany,
        pr_headline: body.prHeadline,
        teardown_content: body.teardownContent,
        recipient_count: sentCount,
      });

    if (logError) {
      console.error('Error logging teardown send:', logError);
    }

    return NextResponse.json({
      success: true,
      sentCount,
      totalLeads: leads.length,
    });
  } catch (error) {
    console.error('Error sending teardown:', error);
    return NextResponse.json({ error: 'Failed to send teardown' }, { status: 500 });
  }
}
