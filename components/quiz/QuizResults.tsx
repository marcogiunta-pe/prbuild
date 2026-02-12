'use client';

import { useState } from 'react';
import { Check, X, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EmailCapture } from '@/components/EmailCapture';
import { checklistCategories, TOTAL_ITEMS, type ChecklistCategory } from '@/data/checklist';

interface QuizResultsProps {
  answers: Record<number, boolean>;
  onRetake: () => void;
}

interface CategoryScore {
  category: ChecklistCategory;
  catIndex: number;
  earned: number;
  total: number;
  missedItems: { globalIndex: number; title: string; recommendation: string }[];
}

function getScoreLabel(score: number): { label: string; color: string; bgColor: string } {
  if (score <= 8) return { label: 'Needs Work', color: 'text-red-600', bgColor: 'bg-red-500' };
  if (score <= 15) return { label: 'Getting There', color: 'text-amber-600', bgColor: 'bg-amber-500' };
  return { label: 'Press-Ready', color: 'text-green-600', bgColor: 'bg-green-500' };
}

function computeResults(answers: Record<number, boolean>): {
  totalScore: number;
  categoryScores: CategoryScore[];
  weakestCategory: CategoryScore | null;
} {
  let globalIndex = 0;
  const categoryScores: CategoryScore[] = [];

  checklistCategories.forEach((category, catIndex) => {
    const isRedFlags = catIndex === 2; // "Red Flags That Get You Deleted"
    let earned = 0;
    const missedItems: CategoryScore['missedItems'] = [];

    category.items.forEach((item, itemIndex) => {
      const answer = answers[globalIndex] ?? false;
      // Red flags: "No" = 1 point (absence of red flag is good)
      // Others: "Yes" = 1 point
      const pointEarned = isRedFlags ? !answer : answer;

      if (pointEarned) {
        earned++;
      } else {
        missedItems.push({
          globalIndex,
          title: item.title,
          recommendation: item.recommendation,
        });
      }
      globalIndex++;
    });

    categoryScores.push({
      category,
      catIndex,
      earned,
      total: category.items.length,
      missedItems,
    });
  });

  const totalScore = categoryScores.reduce((sum, cs) => sum + cs.earned, 0);

  // Weakest category = lowest percentage
  let weakestCategory: CategoryScore | null = null;
  let lowestPct = 1;
  for (const cs of categoryScores) {
    const pct = cs.earned / cs.total;
    if (pct < lowestPct) {
      lowestPct = pct;
      weakestCategory = cs;
    }
  }

  return { totalScore, categoryScores, weakestCategory };
}

export function QuizResults({ answers, onRetake }: QuizResultsProps) {
  const [emailUnlocked, setEmailUnlocked] = useState(false);

  const { totalScore, categoryScores, weakestCategory } = computeResults(answers);
  const { label, color, bgColor } = getScoreLabel(totalScore);
  const pct = Math.round((totalScore / TOTAL_ITEMS) * 100);

  // Top 3 priority fixes (from missed items across all categories)
  const allMissed = categoryScores.flatMap((cs) => cs.missedItems);
  const priorityFixes = allMissed.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Score header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium mb-4">
          Your PR Score
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-6xl font-bold text-gray-900">{totalScore}</div>
          <div className="text-left">
            <div className="text-2xl text-gray-400 font-light">/ {TOTAL_ITEMS}</div>
            <div className={`text-lg font-semibold ${color}`}>{label}</div>
          </div>
        </div>

        {/* Progress ring */}
        <div className="w-full max-w-xs mx-auto mb-6">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${bgColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{pct}% complete</p>
        </div>
      </div>

      {/* Category breakdowns (always visible) */}
      <div className="grid gap-4">
        <h3 className="text-lg font-bold text-gray-900">Category Breakdown</h3>
        {categoryScores.map((cs) => {
          const catPct = Math.round((cs.earned / cs.total) * 100);
          const barColor =
            catPct >= 75 ? 'bg-green-500' : catPct >= 50 ? 'bg-amber-500' : 'bg-red-500';

          return (
            <div key={cs.catIndex} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{cs.category.icon}</span>
                  <span className="font-medium text-gray-900">{cs.category.title}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {cs.earned}/{cs.total}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${catPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Weakest category callout */}
      {weakestCategory && weakestCategory.earned < weakestCategory.total && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">
              Your weakest area: {weakestCategory.category.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You scored {weakestCategory.earned}/{weakestCategory.total} in this category.
              Focus here first for the biggest improvement.
            </p>
          </div>
        </div>
      )}

      {/* Email gate */}
      {!emailUnlocked ? (
        <div className="relative">
          {/* Blurred preview of gated content */}
          <div className="pointer-events-none select-none" aria-hidden>
            <div className="blur-sm opacity-50 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Priority Fixes</h3>
              {priorityFixes.map((item) => (
                <div key={item.globalIndex} className="bg-white border rounded-xl p-4">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gate overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
            <div className="max-w-md w-full">
              <EmailCapture
                variant="card"
                title="Unlock your full report"
                description="Get item-by-item recommendations and a priority action list. Enter your email to see the detailed breakdown."
                buttonText="Unlock Full Report"
                successMessage="Report unlocked! Scroll down for your detailed breakdown."
                leadSource="quiz"
                quizScore={totalScore}
                quizAnswers={Object.fromEntries(
                  Object.entries(answers).map(([k, v]) => [k, v])
                )}
                onSuccess={() => setEmailUnlocked(true)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Priority fixes */}
          {priorityFixes.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Fix These {priorityFixes.length} Things First
              </h3>
              <div className="space-y-3">
                {priorityFixes.map((item, idx) => (
                  <div
                    key={item.globalIndex}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{item.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full item-by-item breakdown */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Item-by-Item Breakdown</h3>
            <div className="space-y-6">
              {categoryScores.map((cs) => (
                <div key={cs.catIndex}>
                  <div className="flex items-center gap-2 mb-3">
                    <span>{cs.category.icon}</span>
                    <h4 className="font-semibold text-gray-900">{cs.category.title}</h4>
                  </div>
                  <div className="space-y-2">
                    {cs.category.items.map((item, itemIdx) => {
                      const globalIdx =
                        checklistCategories
                          .slice(0, cs.catIndex)
                          .reduce((sum, c) => sum + c.items.length, 0) + itemIdx;
                      const answer = answers[globalIdx] ?? false;
                      const isRedFlags = cs.catIndex === 2;
                      const passed = isRedFlags ? !answer : answer;

                      return (
                        <div
                          key={globalIdx}
                          className={`rounded-lg border p-3 ${
                            passed
                              ? 'border-green-200 bg-green-50/50'
                              : 'border-red-200 bg-red-50/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {passed ? (
                              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                              {!passed && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.recommendation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button variant="outline" onClick={onRetake}>
          Retake Quiz
        </Button>
        <Link href="/signup">
          <Button className="bg-secondary hover:bg-secondary/90">
            Let Us Handle All {TOTAL_ITEMS}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
