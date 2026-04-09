'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        We couldn&apos;t load your dashboard. This might be a temporary issue.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Button asChild>
          <Link href="/dashboard/my-releases">Go to My Releases</Link>
        </Button>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        <Link href="/contact" className="text-secondary hover:underline">
          Contact support
        </Link>{' '}
        if this keeps happening.
      </p>
      {/* Diagnostic details — visible to any user so bugs can be reported accurately */}
      <details className="mt-8 text-left">
        <summary className="cursor-pointer text-xs font-mono text-gray-500 hover:text-gray-700">
          Technical details (click to expand)
        </summary>
        <div className="mt-3 p-4 bg-gray-50 rounded-md overflow-auto">
          {error.digest && (
            <p className="text-xs font-mono text-gray-600 mb-2">digest: {error.digest}</p>
          )}
          <p className="text-xs font-mono text-red-700 font-semibold mb-2 break-words">
            {error.name}: {error.message}
          </p>
          {error.stack && (
            <pre className="text-[10px] font-mono text-gray-600 whitespace-pre-wrap break-words overflow-x-auto">
              {error.stack}
            </pre>
          )}
        </div>
      </details>
    </div>
  );
}
