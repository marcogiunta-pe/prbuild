// app/api/notifications/draft-ready/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notifications } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check admin auth
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

    const { releaseId } = await request.json();

    // Get the release request with client info
    const { data: release, error } = await supabase
      .from('release_requests')
      .select('id, company_name, client_id')
      .eq('id', releaseId)
      .single();

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    // Get client's email
    const { data: clientProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', release.client_id)
      .single();

    if (!clientProfile?.email) {
      return NextResponse.json({ error: 'Client email not found' }, { status: 404 });
    }

    // Send the notification email (requires RESEND_API_KEY on Vercel)
    await notifications.draftReady(
      clientProfile.email,
      release.id,
      release.company_name
    );

    return NextResponse.json({ 
      success: true,
      message: `Notification sent to ${clientProfile.email}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send notification';
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
