'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checklistCategories, TOTAL_ITEMS } from '@/data/checklist';
import { QuizResults } from './QuizResults';

type QuizPhase = 'quiz' | 'results';

export function PRScoreQuiz() {
  const [phase, setPhase] = useState<QuizPhase>('quiz');
  const [currentCatIndex, setCurrentCatIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const category = checklistCategories[currentCatIndex];
  const isRedFlags = currentCatIndex === 2;

  // Calculate global start index for current category
  const globalStart = checklistCategories
    .slice(0, currentCatIndex)
    .reduce((sum, cat) => sum + cat.items.length, 0);

  const allItemsAnswered = category.items.every(
    (_, i) => answers[globalStart + i] !== undefined
  );
  const totalAnswered = Object.keys(answers).length;
  const progressPct = Math.round((totalAnswered / TOTAL_ITEMS) * 100);

  const isFirstCategory = currentCatIndex === 0;
  const isLastCategory = currentCatIndex === checklistCategories.length - 1;

  function setAnswer(globalIndex: number, value: boolean) {
    setAnswers((prev) => ({ ...prev, [globalIndex]: value }));
  }

  function handleNext() {
    if (isLastCategory) {
      setPhase('results');
    } else {
      setCurrentCatIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (!isFirstCategory) {
      setCurrentCatIndex((prev) => prev - 1);
    }
  }

  function handleRetake() {
    setAnswers({});
    setCurrentCatIndex(0);
    setPhase('quiz');
  }

  if (phase === 'results') {
    return <QuizResults answers={answers} onRetake={handleRetake} />;
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>
            Category {currentCatIndex + 1} of {checklistCategories.length}
          </span>
          <span>
            {totalAnswered}/{TOTAL_ITEMS} answered
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Category header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{category.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
          {isRedFlags && (
            <p className="text-sm text-gray-500">
              For red flags, &ldquo;No&rdquo; is the good answer
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {category.items.map((item, itemIndex) => {
          const globalIndex = globalStart + itemIndex;
          const answer = answers[globalIndex];

          return (
            <div
              key={globalIndex}
              className={`rounded-xl border-2 p-4 transition-colors ${
                answer === true
                  ? 'border-green-300 bg-green-50/50'
                  : answer === false
                  ? 'border-red-300 bg-red-50/50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {globalIndex + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setAnswer(globalIndex, true)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      answer === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                    }`}
                    aria-label={`Yes for item ${globalIndex + 1}`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswer(globalIndex, false)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      answer === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                    }`}
                    aria-label={`No for item ${globalIndex + 1}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={isFirstCategory}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!allItemsAnswered}
          className="bg-secondary hover:bg-secondary/90"
        >
          {isLastCategory ? 'See My Score' : 'Next Category'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
