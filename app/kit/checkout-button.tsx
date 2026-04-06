'use client';

import { useState } from 'react';

export function KitCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/create-kit-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-60 min-h-[44px]"
      >
        {loading ? 'Redirecting...' : 'Get Your Kit \u2014 $49'}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </>
  );
}
