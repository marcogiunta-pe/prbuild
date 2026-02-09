/**
 * Canonical production URL. Used as fallback when NEXT_PUBLIC_APP_URL is not set (e.g. on Vercel).
 */
export const PRODUCTION_APP_URL = 'https://prbuild.ai';

/**
 * Returns the app base URL for links, redirects, and emails.
 * - In browser: uses window.location.origin so links match the current site.
 * - On server: uses NEXT_PUBLIC_APP_URL, or https://prbuild.ai in production if unset.
 * This prevents localhost from appearing in production emails or redirects.
 */
export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (env) return env;
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return PRODUCTION_APP_URL;
  }
  return 'http://localhost:3000';
}
