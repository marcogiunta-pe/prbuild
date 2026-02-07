'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/reportError';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <p>An error occurred. You can try again.</p>
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
    </div>
  );
}
