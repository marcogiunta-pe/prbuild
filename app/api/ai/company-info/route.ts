import 'openai/shims/web';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 30;

const RequestSchema = z.object({
  websiteUrl: z.string().min(3),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Website URL required' }, { status: 400 });
    }

    const url = parsed.data.websiteUrl.startsWith('http')
      ? parsed.data.websiteUrl
      : `https://${parsed.data.websiteUrl}`;

    // Fetch website content
    let siteContent = '';
    try {
      const res = await globalThis.fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'PRBuild/1.0 (company-info-extractor)' },
      });
      if (res.ok) {
        const html = await res.text();
        siteContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[\s\S]*?<\/nav>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 4000);
      }
    } catch {
      // Site fetch failed — continue with URL only
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      fetch: globalThis.fetch,
      timeout: 20_000,
      maxRetries: 1,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You extract company information from website content. Return ONLY valid JSON with these fields (use null for any field you cannot determine):
{
  "companyName": "string",
  "industry": "string (one of: healthcare, technology, finance, retail, or a custom industry name)",
  "phone": "string or null",
  "address": "string or null (street address only, no city/state/zip)",
  "city": "string or null",
  "state": "string or null (2-letter abbreviation for US, full name otherwise)",
  "zip": "string or null",
  "country": "string or null",
  "boilerplate": "string (50-75 word AP-style about paragraph)",
  "voiceStyle": "string (2-4 words describing the company's communication tone, e.g. 'Professional and authoritative' or 'Innovative and approachable')",
  "logoUrl": "string or null (URL to logo image if found on the site)"
}
Do NOT include any text before or after the JSON.`,
        },
        {
          role: 'user',
          content: `Extract company information from this website: ${url}\n\n${siteContent ? `Website content:\n${siteContent}` : 'Could not fetch website content. Extract what you can from the URL.'}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content || '{}';
    // Parse JSON — handle potential markdown code block wrapping
    const jsonStr = response.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Company info extraction error:', error);
    return NextResponse.json(
      { error: `Failed to extract company info: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
