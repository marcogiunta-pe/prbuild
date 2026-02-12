import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// GET - Unsubscribe a lead from teardown emails
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse(renderPage('Missing token', 'The unsubscribe link is invalid.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('email_leads')
      .update({ subscribed_teardown: false, updated_at: new Date().toISOString() })
      .eq('unsubscribe_token', token)
      .select('email')
      .single();

    if (error || !data) {
      return new NextResponse(renderPage('Link expired', 'This unsubscribe link is no longer valid.'), {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    return new NextResponse(
      renderPage('Unsubscribed', "You've been unsubscribed from the Weekly PR Teardown. You won't receive any more teardown emails."),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse(renderPage('Error', 'Something went wrong. Please try again later.'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function renderPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - PRBuild</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f9fafb; color: #333; }
      .card { max-width: 480px; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
      h1 { color: #6366f1; margin-bottom: 12px; }
      a { color: #6366f1; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>${message}</p>
      <p style="margin-top: 24px;"><a href="/">← Back to PRBuild</a></p>
    </div>
  </body>
</html>`;
}
