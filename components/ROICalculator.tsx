'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calculator, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  CURRENT_COSTS,
  type CurrentServiceKey,
  getPrbuildCost,
  getCurrentMonthlyCost,
  getMonthlySavings,
  getAnnualSavings,
  isBigWin,
} from '@/lib/roi-calculator-utils';

function useTween(target: number, duration = 400): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (value === target) return;
    const start = value;
    const diff = target - start;
    const startTime = Date.now();
    let rafId: number;

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return value;
}

function SimpleConfetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (!active) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const colors = ['#0D9488', '#10B981', '#34D399'];
    setPieces(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100 - 10,
        delay: Math.random() * 200,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    );
    const t = setTimeout(() => setPieces([]), 2000);
    return () => clearTimeout(t);
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            top: 0,
            backgroundColor: p.color,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function ROICalculator() {
  const [releasesPerMonth, setReleasesPerMonth] = useState(2);
  const [currentService, setCurrentService] = useState<CurrentServiceKey>('prweb');
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  const prbuildCost = getPrbuildCost(releasesPerMonth);
  const currentMonthlyCost = getCurrentMonthlyCost(currentService, releasesPerMonth);
  const savings = getMonthlySavings(currentService, releasesPerMonth);
  const annualSavings = getAnnualSavings(currentService, releasesPerMonth);
  const bigWin = isBigWin(annualSavings);

  const tweenSavings = useTween(savings);
  const tweenAnnual = useTween(annualSavings);

  useEffect(() => {
    if (bigWin && annualSavings > 0) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 500);
      return () => clearTimeout(t);
    }
  }, [bigWin, annualSavings]);

  const maxCost = Math.max(currentMonthlyCost, prbuildCost, 1);
  const currentWidth = (currentMonthlyCost / maxCost) * 100;
  const prbuildWidth = (prbuildCost / maxCost) * 100;

  const shareText = `I could save $${annualSavings.toLocaleString()}/year switching to @PRBuild 🤯`;
  const shareUrl = 'https://prbuild.ai';
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'PRBuild Savings',
        text: shareText,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto overflow-hidden">
      <SimpleConfetti active={showConfetti} />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">PR Savings Calculator</h3>
          <p className="text-sm text-gray-500">See how much you could save with PRBuild</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How many press releases do you need per month?
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setReleasesPerMonth(num)}
                className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation ${
                  releasesPerMonth === num
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you currently use?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CURRENT_COSTS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setCurrentService(key as CurrentServiceKey)}
                className={`min-h-[44px] px-4 py-2 rounded-lg font-medium text-sm transition-colors touch-manipulation ${
                  currentService === key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Your current cost</span>
            <span className="font-medium text-gray-900">${currentMonthlyCost.toLocaleString()}/mo</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-red-400/80 transition-all duration-400 ease-out"
              style={{ width: `${currentWidth}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>PRBuild cost</span>
            <span className="font-medium text-primary">${prbuildCost}/mo</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-secondary transition-all duration-400 ease-out"
              style={{ width: `${prbuildWidth}%` }}
            />
          </div>
        </div>

        {/* Results */}
        <div className={`rounded-xl p-6 space-y-4 ${bigWin ? 'ring-2 ring-green-400/50 bg-green-50/50' : 'bg-gray-50'}`}>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-semibold">Monthly savings</span>
              <span className="font-bold text-green-600 text-xl tabular-nums">${tweenSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Annual savings</span>
              <span className="font-semibold text-green-600 tabular-nums">${tweenAnnual.toLocaleString()}/year</span>
            </div>
          </div>

          {annualSavings > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Share2 className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy snippet'}
              </button>
              <a
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Tweet your savings
              </a>
            </div>
          )}
        </div>

        <Link href="/signup" className="block" data-cta="roi-signup">
          <Button className="w-full bg-secondary hover:bg-secondary/90">
            Start Saving Today — First Release Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <p className="text-xs text-gray-500 text-center">
          Plus, PRBuild includes writing—others don&apos;t.
        </p>
      </div>
    </div>
  );
}

export default ROICalculator;
