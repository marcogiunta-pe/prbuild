'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AI_SAMPLE = {
  headline: 'We are excited to announce our innovative new platform that will revolutionize the industry.',
  lede: 'Our synergistic solutions leverage cutting-edge technology to deliver a paradigm shift in how businesses operate. We are thrilled to share this milestone with our valued partners.',
  quote: 'This launch represents an exciting milestone for our company and demonstrates our commitment to excellence.',
};

const PRBUILD_SAMPLE = {
  headline: 'DataSync launches AI platform that cuts processing time by 90%.',
  lede: 'DataSync today announced a new AI-powered data pipeline that reduces processing time from 4 hours to 24 minutes for enterprise customers. The platform is now available in 12 countries.',
  quote: 'We built this because our customers were losing deals waiting on reports. Now they get same-day insights.',
};

export function BeforeAfterComparison() {
  const [view, setView] = useState<'ai' | 'prbuild'>('ai');

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Button
          variant={view === 'ai' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('ai')}
          className={view === 'ai' ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          Generic AI
        </Button>
        <Button
          variant={view === 'prbuild' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('prbuild')}
          className={view === 'prbuild' ? 'bg-secondary' : ''}
        >
          PRBuild
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className={`${view === 'ai' ? 'ring-2 ring-red-200 dark:ring-red-800 border-red-200 dark:border-red-800' : 'opacity-75'} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-700 dark:text-red-400">Generic AI — red flags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="line-through text-gray-500 dark:text-gray-400">{AI_SAMPLE.headline}</p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="underline decoration-red-300 dark:decoration-red-600">{AI_SAMPLE.lede.slice(0, 50)}</span>
              {AI_SAMPLE.lede.slice(50)}
            </p>
            <p className="italic text-gray-500 dark:text-gray-400">&quot;{AI_SAMPLE.quote}&quot;</p>
          </CardContent>
        </Card>
        <Card className={`${view === 'prbuild' ? 'ring-2 ring-green-200 dark:ring-green-700 border-green-200 dark:border-green-700' : 'opacity-75'} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700 dark:text-green-400">PRBuild — what works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-medium text-gray-900 dark:text-gray-100 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-600 pl-2">{PRBUILD_SAMPLE.headline}</p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="bg-green-50 dark:bg-green-900/30 font-medium">{PRBUILD_SAMPLE.lede.slice(0, 40)}</span>
              {PRBUILD_SAMPLE.lede.slice(40)}
            </p>
            <p className="italic text-gray-700 dark:text-gray-300 border-l-2 border-green-400 dark:border-green-600 pl-2">&quot;{PRBUILD_SAMPLE.quote}&quot;</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Toggle to compare. Left: clichés and AI-speak. Right: specific metrics, punchy headline, real quote.
      </p>
    </div>
  );
}
