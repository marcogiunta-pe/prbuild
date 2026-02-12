'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailCaptureProps {
  title?: string;
  description?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'card';
  leadSource?: string;
  quizScore?: number;
  quizAnswers?: Record<string, boolean>;
  onSuccess?: () => void;
}

export function EmailCapture({
  title = 'Get PR tips in your inbox',
  description = 'Weekly insights on getting press coverage. No spam, unsubscribe anytime.',
  buttonText = 'Subscribe',
  successMessage = 'Thanks! Check your inbox to confirm.',
  className = '',
  variant = 'default',
  leadSource = 'checklist',
  quizScore,
  quizAnswers,
  onSuccess,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          leadSource,
          quizScore: quizScore ?? undefined,
          quizAnswers: quizAnswers ?? undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setEmail('');
      onSuccess?.();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={status === 'loading' || status === 'success'}
        />
        <Button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="bg-secondary hover:bg-secondary/90"
        >
          {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === 'success' && <Check className="w-4 h-4" />}
          {status === 'idle' && buttonText}
          {status === 'error' && buttonText}
        </Button>
      </form>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-primary/5 border border-primary/10 rounded-2xl p-8 ${className}`}>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-green-600 font-medium" aria-live="polite">
            <Check className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={status === 'loading'}
            />
            {status === 'error' && (
              <p className="text-red-500 text-sm" role="alert">{errorMessage}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {buttonText}
            </Button>
          </form>
        )}

        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div className={className}>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-green-600 font-medium py-3" aria-live="polite">
          <Check className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="you@company.com"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={status === 'loading'}
          />
          <Button
            type="submit"
            size="lg"
            className="bg-secondary hover:bg-secondary/90"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {buttonText}
            {status !== 'loading' && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-500 text-sm mt-2" role="alert">{errorMessage}</p>
      )}
    </div>
  );
}

export default EmailCapture;
