// lib/safe-fetch.ts
// SSRF guard for server-side fetches of user-supplied URLs (company website
// scraping). Validates the scheme and rejects any URL whose host resolves to a
// private, loopback, link-local, or cloud-metadata address.
//
// Residual: there is a small TOCTOU window between DNS resolution here and the
// actual fetch (DNS rebinding). Pinning the resolved IP through to connect time
// is not supported by global fetch; auth + this check cover the realistic
// threat for this app. Routes using this must run on the Node.js runtime.

import dns from 'node:dns/promises';
import net from 'node:net';

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const p = ip.split('.').map(Number);
    if (p[0] === 0) return true;                       // "this" network
    if (p[0] === 10) return true;                      // private
    if (p[0] === 127) return true;                     // loopback
    if (p[0] === 169 && p[1] === 254) return true;     // link-local + 169.254.169.254 metadata
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true; // private
    if (p[0] === 192 && p[1] === 168) return true;     // private
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true; // CGNAT
    return false;
  }
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true;  // loopback / unspecified
  if (lower.startsWith('fe80')) return true;           // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/); // IPv4-mapped
  if (mapped) return isPrivateIp(mapped[1]);
  return false;
}

/**
 * Validate that a user-supplied URL is a public http(s) endpoint safe to fetch
 * server-side. Throws on anything internal/private. Returns the parsed URL.
 */
export async function assertPublicHttpUrl(rawUrl: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL');
  }

  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('Only http(s) URLs are allowed');
  }

  const host = u.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new Error('Refusing to fetch an internal host');
  }

  // IP literal: check directly.
  if (net.isIP(host)) {
    if (isPrivateIp(host)) throw new Error('Refusing to fetch a private address');
    return u;
  }

  // Hostname: resolve and reject if ANY resolved address is private.
  const results = await dns.lookup(host, { all: true });
  if (results.length === 0) throw new Error('Host did not resolve');
  for (const r of results) {
    if (isPrivateIp(r.address)) throw new Error('Refusing to fetch a private address');
  }
  return u;
}
