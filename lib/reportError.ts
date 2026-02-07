/**
 * Client-side error reporting. Replace with Sentry (or similar) when ready:
 *
 *   import * as Sentry from '@sentry/nextjs';
 *   export function reportError(error: Error) {
 *     Sentry.captureException(error);
 *   }
 */
export function reportError(error: Error): void {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV === 'development') {
    console.error('[reportError]', error);
  }
  // Plug in Sentry.captureException(error) here when you add @sentry/nextjs
}
