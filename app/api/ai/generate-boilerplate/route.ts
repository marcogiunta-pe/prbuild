import 'openai/shims/web';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 30;

const RequestSchema = z.object({
  companyName: z.string().min(1),
  companyWebsite: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Company name and valid website URL required' }, { status: 400 });
    }
    const { companyName, companyWebsite } = parsed.data;

    // Fetch the company website to get content
    let siteContent = '';
    try {
      const res = await globalThis.fetch(companyWebsite, {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'PRBuild/1.0 (boilerplate generator)' },
      });
      if (res.ok) {
        const html = await res.text();
        // Extract text content, strip tags, limit to 3000 chars
        siteContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[\s\S]*?<\/nav>/gi, '')
          .replace(/<footer[\s\S]*?<\/footer>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 3000);
      }
    } catch {
      // Website fetch failed — we'll generate from the company name alone
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      fetch: globalThis.fetch,
      timeout: 15_000,
      maxRetries: 1,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You write press release boilerplates. A boilerplate is the standard "About" paragraph at the end of a press release. It should be 50-75 words, written in third person, factual, and professional. Include what the company does, who it serves, and any notable facts (years in business, location, key achievements). Do NOT use marketing fluff. Write in AP style.`,
        },
        {
          role: 'user',
          content: `Write a press release boilerplate for ${companyName}.${siteContent ? `\n\nHere is content from their website (${companyWebsite}):\n${siteContent}` : `\n\nTheir website is ${companyWebsite}. Use the company name and website URL to write a general boilerplate.`}\n\nReturn ONLY the boilerplate paragraph, nothing else. No headers, no labels, just the paragraph.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    });

    const boilerplate = completion.choices[0].message.content?.trim() || '';

    return NextResponse.json({ boilerplate });
  } catch (error: any) {
    console.error('Boilerplate generation error:', error);
    return NextResponse.json(
      { error: `Failed to generate boilerplate: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
