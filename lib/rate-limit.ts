// lib/rate-limit.ts
import { createAdminClient } from '@/lib/supabase/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) {
      store.delete(key);
    }
  }
}

/**
 * Simple in-memory rate limiter.
 * Returns { success: true } if under limit, or { success: false, retryAfter } if exceeded.
 *
 * Note: On serverless (Vercel), each instance has its own memory, so this is
 * per-instance rate limiting. It still protects against bursts hitting the same
 * instance and is effective for basic abuse prevention.
 */
export function rateLimit(
  key: string,
  { maxRequests, windowMs }: { maxRequests: number; windowMs: number }
): { success: boolean; retryAfter?: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (entry.count < maxRequests) {
    entry.count++;
    return { success: true };
  }

  return {
    success: false,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  };
}

/**
 * Durable, cross-instance rate limiter backed by the Postgres check_rate_limit
 * RPC. Use this on serverless — unlike the in-memory rateLimit() above, the
 * count is shared across all instances and survives cold starts.
 *
 * Fail-safe: if the DB call errors (RPC missing, network blip), fall back to
 * the in-memory limiter so a backend hiccup degrades protection rather than
 * either locking everyone out or removing the limit entirely.
 */
export async function rateLimitDurable(
  key: string,
  { maxRequests, windowMs }: { maxRequests: number; windowMs: number }
): Promise<{ success: boolean; retryAfter?: number }> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc('check_rate_limit', {
      p_key: key,
      p_max: maxRequests,
      p_window_seconds: Math.max(1, Math.ceil(windowMs / 1000)),
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) throw new Error('check_rate_limit returned no row');
    return row.allowed
      ? { success: true }
      : { success: false, retryAfter: row.retry_after ?? Math.ceil(windowMs / 1000) };
  } catch {
    // Degrade to per-instance in-memory limiting rather than fail open.
    return rateLimit(key, { maxRequests, windowMs });
  }
}

/** Extract a client identifier from the request for rate limiting. */
export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return ip;
}
