import 'openai/shims/web';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 30;

const RequestSchema = z.object({
  companyName: z.string().min(1),
  announcementType: z.string().min(1),
  industry: z.string().optional(),
  currentHook: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Company name and announcement type required' }, { status: 400 });
    }
    const { companyName, announcementType, industry, currentHook } = parsed.data;

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
          content: `You write news hooks for press releases. A news hook is ONE sentence (15-25 words) that captures why this announcement is newsworthy. It should answer "what happened and why should anyone care?" Write in third person. Be specific and concrete — no fluff, no "excited to announce", no generic phrases. Structure: "[Company] [action verb] [what] to [benefit/impact]."`,
        },
        {
          role: 'user',
          content: `Generate exactly 3 different news hook options for this press release:

Company: ${companyName}
Announcement type: ${announcementType.replace('_', ' ')}
Industry: ${industry || 'general'}
${currentHook ? `Current draft (improve on this): ${currentHook}` : ''}

Return ONLY the 3 hooks, one per line, numbered 1. 2. 3. — nothing else.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content || '';
    const hooks = response
      .split('\n')
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').replace(/^[""]|[""]$/g, '').trim())
      .filter(line => line.length > 10 && line.length < 200);

    return NextResponse.json({ hooks: hooks.slice(0, 3) });
  } catch (error: any) {
    console.error('Hook suggestion error:', error);
    return NextResponse.json(
      { error: `Failed to suggest hooks: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
