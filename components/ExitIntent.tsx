'use client';

import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exitIntentShown')) return;

    // Desktop: exit intent (mouse leaves top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Mobile: scroll depth 70%
    const handleScroll = () => {
      if (!isMobile()) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0 && window.scrollY >= scrollHeight * 0.7) {
        setIsVisible(true);
        sessionStorage.setItem('exitIntentShown', 'true');
        window.removeEventListener('scroll', handleScroll);
      }
    };

    const timeout = setTimeout(() => {
      if (isMobile()) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      } else {
        document.addEventListener('mouseleave', handleMouseLeave);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setIsVisible(false)}
    >
      <div
        className="bg-paper-light rounded-md p-8 max-w-lg w-full relative animate-in zoom-in-95 duration-300 border border-rule"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-muted hover:text-ink rounded-sm hover:bg-paper-dark transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Gift className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl font-display text-ink mb-2">
            Before you go — your first release is free
          </h2>
          <ul className="text-ink-muted mb-6 space-y-2 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">✓ Written in 24 hours</li>
            <li className="flex items-center gap-2">✓ Reviewed by our journalist panel</li>
            <li className="flex items-center gap-2">✓ No credit card required</li>
          </ul>

          <Link href="/signup" className="block" data-cta="exit-intent-signup">
            <Button size="lg" className="w-full bg-primary hover:bg-primary-700 rounded-sm">
              Get My Free Release →
            </Button>
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="mt-4 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
