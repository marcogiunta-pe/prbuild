'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

const ANNOTATIONS: { id: string; tip: string }[] = [
  { id: 'headline', tip: 'Panel liked: "Specific, under 100 chars"' },
  { id: 'lede', tip: 'Panel: "Who, what, when in sentence one"' },
  { id: 'quote', tip: 'Panel: "Adds perspective, not fluff"' },
  { id: 'boilerplate', tip: 'Panel: "Standard, complete"' },
  { id: 'cta', tip: 'Panel: "Clear next step"' },
];

export function PressReleasePreview() {
  const [version, setVersion] = useState<'draft' | 'final'>('final');
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const draftHeadline = 'We are excited to announce our new platform that will revolutionize the industry.';
  const finalHeadline = 'DataSync launches AI data pipeline that cuts processing time by 90%.';

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            See a Real Press Release
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Hover highlights to see what our journalist panel said. Toggle Draft vs Final to see the improvement.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setVersion('draft')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors min-h-[44px] touch-manipulation ${
                version === 'draft' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setVersion('final')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors min-h-[44px] touch-manipulation ${
                version === 'final' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Final
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sample release</span>
            <Badge className="bg-green-100 text-green-800 text-xs">Quality: 8.5/10</Badge>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div
              id="headline"
              onMouseEnter={() => setActiveTip('headline')}
              onMouseLeave={() => setActiveTip(null)}
              className={`relative border-l-4 pl-3 ${
                version === 'draft' ? 'border-amber-300 bg-amber-50/50' : 'border-green-500 bg-green-50/50'
              }`}
            >
              <span className="font-semibold text-gray-900">
                {version === 'draft' ? draftHeadline : finalHeadline}
              </span>
              {activeTip === 'headline' && (
                <div className="absolute left-0 top-full mt-1 z-10 bg-gray-900 text-white text-xs rounded px-2 py-1.5 shadow-lg max-w-xs">
                  {ANNOTATIONS.find((a) => a.id === 'headline')?.tip}
                </div>
              )}
            </div>
            <div
              id="lede"
              onMouseEnter={() => setActiveTip('lede')}
              onMouseLeave={() => setActiveTip(null)}
              className="relative border-l-4 border-blue-300 pl-3 bg-blue-50/30"
            >
              <span className="text-gray-700">
                SAN FRANCISCO, Jan 15, 2025 — DataSync today announced a new AI-powered data pipeline that reduces
                processing time from 4 hours to 24 minutes for enterprise customers.
              </span>
              {activeTip === 'lede' && (
                <div className="absolute left-0 top-full mt-1 z-10 bg-gray-900 text-white text-xs rounded px-2 py-1.5 shadow-lg max-w-xs">
                  {ANNOTATIONS.find((a) => a.id === 'lede')?.tip}
                </div>
              )}
            </div>
            <div
              id="quote"
              onMouseEnter={() => setActiveTip('quote')}
              onMouseLeave={() => setActiveTip(null)}
              className="relative border-l-4 border-secondary/50 pl-3 bg-secondary/5 italic"
            >
              &quot;We built this because our customers were losing deals waiting on reports,&quot; said Jane Doe, CEO.
              {activeTip === 'quote' && (
                <div className="absolute left-0 top-full mt-1 z-10 bg-gray-900 text-white text-xs rounded px-2 py-1.5 shadow-lg max-w-xs">
                  {ANNOTATIONS.find((a) => a.id === 'quote')?.tip}
                </div>
              )}
            </div>
            <p className="text-gray-600">
              DataSync serves over 500 enterprise customers. The platform is available in 12 countries.
            </p>
            <div
              id="cta"
              onMouseEnter={() => setActiveTip('cta')}
              onMouseLeave={() => setActiveTip(null)}
              className="relative border-l-4 border-primary/30 pl-3 text-primary font-medium"
            >
              For more information, visit datasync.example.com or contact press@datasync.example.com.
              {activeTip === 'cta' && (
                <div className="absolute left-0 top-full mt-1 z-10 bg-gray-900 text-white text-xs rounded px-2 py-1.5 shadow-lg max-w-xs">
                  {ANNOTATIONS.find((a) => a.id === 'cta')?.tip}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
