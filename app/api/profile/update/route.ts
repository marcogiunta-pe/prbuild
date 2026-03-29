import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Auth check with user's session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Whitelist allowed fields to prevent injection of role, is_free_user, etc.
    const allowedFields: Record<string, unknown> = {};
    const permitted = [
      'full_name',
      'first_name',
      'last_name',
      'phone',
      'job_title',
      'media_contact_name',
      'media_contact_title',
      'media_contact_email',
      'media_contact_phone',
      'company_name',
      'company_address',
      'company_phone',
      'company_website',
      'company_logo_url',
      'company_boilerplate',
      'company_voice_style',
      'industry',
    ];

    for (const key of permitted) {
      if (key in body) {
        allowedFields[key] = body[key] ?? null;
      }
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
    }

    // Use admin client to bypass RLS for the update
    const admin = createAdminClient();
    const { error: updateError } = await admin
      .from('profiles')
      .update(allowedFields)
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
