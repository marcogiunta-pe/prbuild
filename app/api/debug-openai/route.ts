// Temporary diagnostic endpoint — remove after debugging
import 'openai/shims/web';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not set' });
  }

  const diagnostics: Record<string, any> = {
    keyPrefix: key.slice(0, 10) + '...',
    keyLength: key.length,
    timestamp: new Date().toISOString(),
  };

  // Test 1: Raw fetch to OpenAI
  try {
    const res = await globalThis.fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${key}` },
      signal: AbortSignal.timeout(10000),
    });
    diagnostics.rawFetch = { status: res.status, ok: res.ok };
  } catch (e: any) {
    diagnostics.rawFetch = { error: e.message, cause: e.cause?.message };
  }

  // Test 2: OpenAI SDK
  try {
    const openai = new OpenAI({
      apiKey: key,
      fetch: globalThis.fetch,
      timeout: 15_000,
      maxRetries: 0,
    });
    const models = await openai.models.list();
    diagnostics.sdk = { ok: true, modelCount: models.data?.length };
  } catch (e: any) {
    diagnostics.sdk = {
      error: e.message,
      name: e.name,
      code: e.code,
      status: e.status,
      type: e.type,
      cause: e.cause?.message || e.cause?.code,
    };
  }

  return NextResponse.json(diagnostics);
}
