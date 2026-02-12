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

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsVisible(false)}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Gift className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Before you go — your first release is free
          </h2>
          <ul className="text-gray-600 mb-6 space-y-2 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">✓ Written in 24 hours</li>
            <li className="flex items-center gap-2">✓ Reviewed by our journalist panel</li>
            <li className="flex items-center gap-2">✓ No credit card required</li>
          </ul>

          <Link href="/signup" className="block" data-cta="exit-intent-signup">
            <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90">
              Get My Free Release →
            </Button>
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            No thanks, I'll pay $400 for PRWeb instead
          </button>
        </div>
      </div>
    </div>
  );
}
