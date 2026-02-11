// app/api/journalist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { sendJournalistVerificationEmail } from '@/lib/email';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';

// GET - List journalist subscribers (admin only)
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

    const { data: journalists, error } = await supabase
      .from('journalist_subscribers')
      .select('id, email, name, outlet, beat, categories, frequency, is_verified, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      console.error('Error fetching journalist subscribers:', error);
      return NextResponse.json({ error: 'Failed to fetch journalists' }, { status: 500 });
    }

    return NextResponse.json({ journalists });
  } catch (error) {
    console.error('Error fetching journalists:', error);
    return NextResponse.json({ error: 'Failed to fetch journalists' }, { status: 500 });
  }
}

// POST - Subscribe a journalist (public)
export async function POST(request: NextRequest) {
  try {
    const ip = getRateLimitKey(request);
    const { success, retryAfter } = rateLimit(`journalist:${ip}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 });
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const body = await request.json();
    
    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!body.categories || body.categories.length === 0) {
      return NextResponse.json({ error: 'At least one category is required' }, { status: 400 });
    }

    // Use admin client for public subscription (bypasses RLS)
    const supabase = createAdminClient();

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    const { data, error } = await supabase
      .from('journalist_subscribers')
      .insert({
        email: body.email,
        name: body.name || null,
        outlet: body.outlet || null,
        beat: body.beat || null,
        categories: body.categories,
        frequency: body.frequency || 'weekly',
        is_verified: false,
        verification_token: verificationToken,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
      }
      console.error('Error subscribing journalist:', error);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    // Send verification email
    try {
      await sendJournalistVerificationEmail(body.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the subscription, just log the error
    }

    return NextResponse.json({ 
      success: true,
      message: 'Please check your email to verify your subscription',
    });
  } catch (error) {
    console.error('Error subscribing journalist:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
