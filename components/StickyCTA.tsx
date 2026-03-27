'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already dismissed this session
    if (sessionStorage.getItem('stickyCTADismissed')) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Show after scrolling past hero section (roughly 600px)
      const shouldShow = window.scrollY > 600 && !isDismissed;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('stickyCTADismissed', 'true');
  };

  // Only show on mobile
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-in slide-in-from-bottom duration-300">
      <div className="bg-paper-light border-t border-rule p-4 pb-safe">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-ink truncate">
              Get your first release free
            </p>
            <p className="text-xs text-ink-muted">
              No credit card required
            </p>
          </div>
          <Link href="/signup" data-cta="sticky-cta">
            <Button size="default" className="bg-primary hover:bg-primary-700 rounded-sm whitespace-nowrap min-h-[44px]">
              Get Free Release →
            </Button>
          </Link>
          <button
            onClick={handleDismiss}
            className="p-2 text-ink-muted hover:text-ink rounded-sm hover:bg-paper-dark transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
