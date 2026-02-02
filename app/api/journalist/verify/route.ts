// app/api/journalist/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/journalist/subscribe?error=invalid_token', request.url));
    }

    const supabase = createAdminClient();

    // Find and verify the subscriber
    const { data: subscriber, error } = await supabase
      .from('journalist_subscribers')
      .update({ 
        is_verified: true,
        verification_token: null,
      })
      .eq('verification_token', token)
      .select()
      .single();

    if (error || !subscriber) {
      return NextResponse.redirect(new URL('/journalist/subscribe?error=invalid_token', request.url));
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/journalist/subscribe?verified=true', request.url));
  } catch (error) {
    console.error('Error verifying journalist:', error);
    return NextResponse.redirect(new URL('/journalist/subscribe?error=server_error', request.url));
  }
}
