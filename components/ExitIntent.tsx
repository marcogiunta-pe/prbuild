'use client';

import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Only trigger once per session
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exitIntentShown')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through the top of the viewport
      if (e.clientY <= 0) {
        setIsVisible(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Delay enabling to avoid triggering immediately
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsVisible(false)}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200"
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

          <h2 className="text-2xl font-bold mb-2">
            Wait! Your first release is free.
          </h2>
          <p className="text-gray-600 mb-6">
            No credit card required. No catch. See why companies are switching from PRWeb.
          </p>

          <Link href="/signup" className="block">
            <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90">
              Claim My Free Release →
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
