'use client';

import { useEffect, useRef } from 'react';
import { analytics } from '@/lib/analytics';

export function useScrollDepth() {
  const milestones = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track at 25%, 50%, 75%, 90%, and 100%
      [25, 50, 75, 90, 100].forEach((milestone) => {
        if (scrollPercent >= milestone && !milestones.current.has(milestone)) {
          milestones.current.add(milestone);
          analytics.scrollDepth(milestone);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

export default useScrollDepth;
