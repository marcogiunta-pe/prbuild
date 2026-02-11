'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-6 w-6 text-red-400" />
      </div>
      <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
      <p className="text-slate-400 mb-6">
        We couldn&apos;t load the admin panel. This might be a temporary issue.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={reset} variant="outline" className="border-slate-600 text-slate-200">
          Try again
        </Button>
        <Button asChild>
          <Link href="/admin/requests">Go to Requests</Link>
        </Button>
      </div>
    </div>
  );
}
