'use client';

import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checklistCategories } from '@/data/checklist';

// Curated 5 items from different categories for the teaser
const TEASER_ITEMS = [
  { catIndex: 0, itemIndex: 0 }, // "Is there an actual news hook?"
  { catIndex: 1, itemIndex: 0 }, // "Does your headline state the news?"
  { catIndex: 2, itemIndex: 2 }, // 'Does it start with "excited to announce"?'
  { catIndex: 1, itemIndex: 4 }, // "Is it under 500 words?"
  { catIndex: 3, itemIndex: 1 }, // "Is the outreach personalized?"
];

const teaserItems = TEASER_ITEMS.map(({ catIndex, itemIndex }) => ({
  icon: checklistCategories[catIndex].icon,
  category: checklistCategories[catIndex].title,
  title: checklistCategories[catIndex].items[itemIndex].title,
}));

export function QuizTeaser() {
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        How Does Your Press Release Score?
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
        Journalists check 23 things before they decide whether to cover your story or hit delete.
        Take our free quiz to find out where you stand.
      </p>

      <div className="max-w-2xl mx-auto grid gap-3 mb-10">
        {teaserItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 text-left"
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500">{item.category}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-2">
          <span>+ 18 more items in the full quiz</span>
        </div>
      </div>

      <Link href="/resources/pr-score" data-cta="quiz-teaser">
        <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8">
          Take the Full Quiz
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
