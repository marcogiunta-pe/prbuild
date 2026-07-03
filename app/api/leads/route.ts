import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendLeadWelcomeEmail } from '@/lib/email';
import { rateLimitDurable, getRateLimitKey } from '@/lib/rate-limit';
import { requireAdmin } from '@/lib/auth';

const VALID_SOURCES = ['quiz', 'checklist', 'teardown_signup'];

// GET - List email leads (admin only)
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const { data: leads, error } = await auth.supabase
      .from('email_leads')
      .select('id, email, name, company_name, lead_source, quiz_score, subscribed_teardown, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      console.error('Error fetching email leads:', error);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST - Capture a new email lead (public)
export async function POST(request: NextRequest) {
  try {
    const ip = getRateLimitKey(request);
    const { success, retryAfter } = await rateLimitDurable(`leads:${ip}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 });
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const body = await request.json();

    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!body.leadSource || !VALID_SOURCES.includes(body.leadSource)) {
      return NextResponse.json({ error: 'Valid lead source is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Don't blow away an existing lead's unsubscribe_token (that would break
    // links already emailed to them) or overwrite stored name/company with null
    // when this resubmit omits them. Update in place; only insert mints a token.
    const { data: existing } = await supabase
      .from('email_leads')
      .select('id')
      .eq('email', body.email)
      .maybeSingle();

    let error;
    if (existing) {
      const updates: Record<string, any> = {
        lead_source: body.leadSource,
        subscribed_teardown: true,
        updated_at: new Date().toISOString(),
      };
      if (body.name) updates.name = body.name;
      if (body.companyName) updates.company_name = body.companyName;
      if (body.quizScore != null) updates.quiz_score = body.quizScore;
      if (body.quizAnswers != null) updates.quiz_answers = body.quizAnswers;
      ({ error } = await supabase.from('email_leads').update(updates).eq('id', existing.id));
    } else {
      ({ error } = await supabase.from('email_leads').insert({
        email: body.email,
        name: body.name || null,
        company_name: body.companyName || null,
        lead_source: body.leadSource,
        quiz_score: body.quizScore ?? null,
        quiz_answers: body.quizAnswers ?? null,
        subscribed_teardown: true,
        unsubscribe_token: crypto.randomUUID(),
        updated_at: new Date().toISOString(),
      }));
    }

    if (error) {
      console.error('Error saving email lead:', error);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    // Send welcome email async (don't fail on email error)
    try {
      await sendLeadWelcomeEmail(body.email, body.leadSource);
    } catch (emailError) {
      console.error('Failed to send lead welcome email:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
