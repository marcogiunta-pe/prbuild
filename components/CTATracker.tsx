'use client';

import { useEffect } from 'react';
import { trackCTA } from '@/lib/analytics';

export function CTATracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.('[data-cta]') as HTMLElement | null;
      if (target?.dataset?.cta) {
        trackCTA(target.dataset.cta, target.textContent?.slice(0, 80) ?? undefined);
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);
  return null;
}
