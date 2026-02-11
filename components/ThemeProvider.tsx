'use client';

import { useEffect, ReactNode } from 'react';

/**
 * Enforces light mode. No theme switching - site is always light.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);
  return <>{children}</>;
}
