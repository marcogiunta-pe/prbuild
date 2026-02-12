'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Circle, X, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingChecklistProps {
  hasCompanyName: boolean;
  releaseCount: number;
  hasReviewedRelease: boolean;
}

interface ChecklistItem {
  label: string;
  href: string;
  complete: boolean;
}

export function OnboardingChecklist({
  hasCompanyName,
  releaseCount,
  hasReviewedRelease,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);

  const items: ChecklistItem[] = [
    { label: 'Complete your profile', href: '/dashboard/account', complete: hasCompanyName },
    { label: 'Submit your first release', href: '/dashboard/new-request', complete: releaseCount > 0 },
    { label: 'Review your draft', href: '/dashboard/my-releases', complete: hasReviewedRelease },
  ];

  const completedCount = items.filter((i) => i.complete).length;
  const allComplete = completedCount === items.length;

  // Auto-complete onboarding when all steps are done
  useEffect(() => {
    if (allComplete) {
      fetch('/api/onboarding/complete', { method: 'POST' }).catch(() => {});
    }
  }, [allComplete]);

  const handleDismiss = async () => {
    setDismissed(true);
    try {
      await fetch('/api/onboarding/dismiss', { method: 'POST' });
    } catch {
      // Non-critical — UI is already hidden
    }
  };

  if (dismissed) return null;

  return (
    <Card className="mb-6 border-secondary/20 bg-secondary/5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Getting Started</h3>
            <p className="text-sm text-gray-600">
              {allComplete
                ? 'You\'re all set! You\'ve completed all the onboarding steps.'
                : `Complete these steps to get the most out of PRBuild (${completedCount}/${items.length})`}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Dismiss checklist"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-secondary rounded-full h-2 transition-all duration-500"
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.complete ? '#' : item.href}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                item.complete
                  ? 'bg-white/60'
                  : 'bg-white hover:bg-white/80'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.complete ? (
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                )}
                <span
                  className={`text-sm font-medium ${
                    item.complete ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {!item.complete && (
                <ArrowRight className="h-4 w-4 text-gray-400" />
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
