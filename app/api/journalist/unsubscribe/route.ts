// app/api/journalist/unsubscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/journalist/subscribe?error=invalid_token', request.url));
    }

    const supabase = createAdminClient();

    // Find and delete the subscriber
    const { error } = await supabase
      .from('journalist_subscribers')
      .delete()
      .eq('unsubscribe_token', token);

    if (error) {
      console.error('Unsubscribe error:', error);
      return NextResponse.redirect(new URL('/journalist/subscribe?error=server_error', request.url));
    }

    // Redirect to unsubscribed confirmation
    return NextResponse.redirect(new URL('/journalist/subscribe?unsubscribed=true', request.url));
  } catch (error) {
    console.error('Error unsubscribing journalist:', error);
    return NextResponse.redirect(new URL('/journalist/subscribe?error=server_error', request.url));
  }
}
