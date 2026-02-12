'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageView } from '@/lib/analytics';
import { useScrollDepth } from '@/hooks/useScrollDepth';

export function AnalyticsProvider() {
  const pathname = usePathname();

  useScrollDepth();

  useEffect(() => {
    pageView(pathname);
  }, [pathname]);

  return null;
}
