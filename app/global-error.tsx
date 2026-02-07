'use client';

import { reportError } from '@/lib/reportError';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window !== 'undefined') reportError(error);
  return (
    <html lang="en">
      <body style={{ padding: 40, fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>A critical error occurred. You can try again.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
          }}
        >
          Try again
        </button>
        <p style={{ marginTop: 24 }}>
          <a href="/">Go home</a>
        </p>
      </body>
    </html>
  );
}
