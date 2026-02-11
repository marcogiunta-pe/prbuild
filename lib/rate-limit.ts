// lib/rate-limit.ts

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

/** Extract a client identifier from the request for rate limiting. */
export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return ip;
}
